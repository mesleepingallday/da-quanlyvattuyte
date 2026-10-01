<script setup lang="ts">
import { item } from '~/data/catalog'
import { fold, nf } from '~/utils/format'

useHead({ title: 'Tồn kho' })

type Seg = 'tat-ca' | 'chu-y' | 'biet-tru'
const route = useRoute()
const { role } = useSession()
const { stock, attention, quarantine } = useInventory()
const { scanOpen } = useNav()

const seg = useState<Seg>('kho-seg', () => 'tat-ca')
watch(() => route.query.loc, (v) => { if (v) seg.value = v as Seg }, { immediate: true })

const q = ref('')
const term = computed(() => fold(q.value.trim()))
const match = (ma: string) => !term.value || fold(`${item(ma).ten} ${ma} ${item(ma).nhom} ${stock.value.find(s => s.item.ma === ma)?.lots.map(l => l.so).join(' ')}`).includes(term.value)

const segments = computed(() => [
  { label: 'Tất cả', value: 'tat-ca' as Seg },
  { label: 'Cần chú ý', value: 'chu-y' as Seg, count: attention.value.length },
  { label: 'Biệt trữ', value: 'biet-tru' as Seg, count: quarantine.value.length }
])

const NHOM_ORDER = ['Tiêm truyền', 'Bảo hộ', 'Băng gạc', 'Xét nghiệm', 'Hóa chất']
const byGroup = computed(() => NHOM_ORDER.map(n => ({ nhom: n, rows: stock.value.filter(s => s.item.nhom === n && match(s.item.ma)) })).filter(g => g.rows.length))
const attn = computed(() => attention.value.filter(a => match(a.item.ma)))
const quar = computed(() => quarantine.value.filter(l => match(l.ma)))

const totals = computed(() => ({ items: stock.value.length, lots: stock.value.reduce((a, s) => a + s.lots.length, 0) }))
const detailOpen = computed(() => !!route.params.ma)
</script>

<template>
  <div class="lg:grid lg:h-dvh lg:grid-cols-[minmax(360px,420px)_minmax(0,1fr)]">
    <section class="scroll-pane min-w-0 lg:overflow-y-auto lg:border-r lg:border-(--hairline)" :class="detailOpen && 'hidden lg:block'" aria-label="Danh sách tồn kho">
      <AppPageHeader title="Tồn kho" :subtitle="`${totals.items} vật tư, ${totals.lots} lô, kho chính`">
        <template #actions>
          <UButton v-if="role === 'kho'" icon="i-lucide-scan-barcode" color="primary" variant="ghost" square aria-label="Quét mã lô" @click="scanOpen = true" />
        </template>
        <template #below>
          <UiSegmented v-model="seg" :options="segments" label="Lọc tồn kho" class="mt-4" />
          <UInput v-model="q" icon="i-lucide-search" placeholder="Tìm vật tư hoặc số lô" aria-label="Tìm vật tư hoặc số lô" class="mt-3 w-full" />
        </template>
      </AppPageHeader>

      <div class="space-y-6 px-4 pb-10 lg:px-8">
        <template v-if="seg === 'tat-ca'">
          <UiGroup v-for="g in byGroup" :key="g.nhom" :title="g.nhom">
            <ItemStockRow v-for="s in g.rows" :key="s.item.ma" :info="s" :selected="route.params.ma === s.item.ma" />
          </UiGroup>
          <UiTip v-if="!q" id="kho-fefo" icon="i-lucide-hourglass" title="Thanh dưới mỗi vật tư là hạn dùng của lô xuất trước">
            Lô hết hạn sớm nhất luôn được xuất trước (FEFO). Thanh chuyển cam khi còn dưới 90 ngày, đỏ khi dưới 30 ngày.
          </UiTip>
        </template>

        <UiGroup v-else-if="seg === 'chu-y'" footer="Đỏ: hết hạn hoặc còn dưới 30 ngày. Cam: còn dưới 90 ngày hoặc dưới tồn tối thiểu.">
          <ItemAttentionRow v-for="a in attn" :key="a.kind + a.item.ma + (a.lot?.so ?? '')" :a="a" />
          <UiEmpty v-if="!attn.length" compact icon="i-lucide-check-check" title="Không có lô nào cần chú ý" />
        </UiGroup>

        <UiGroup v-else footer="Lô biệt trữ không được cấp phát và không tính vào tồn dùng được.">
          <UiRow v-for="l in quar" :key="l.so" :to="{ path: `/kho/${l.ma}`, query: { lo: l.so } }" :inset="76" chevron>
            <template #leading>
              <ItemThumb :item="l.ma" :size="48" />
            </template>
            <div class="truncate text-headline text-highlighted">
              {{ item(l.ma).ten }}
            </div>
            <div class="truncate text-callout text-muted tabular">
              Lô {{ l.so }}, {{ nf(l.sl) }} {{ item(l.ma).dvt.toLowerCase() }}
            </div>
            <div class="mt-1 text-footnote text-muted">
              {{ l.qLyDo }}
            </div>
          </UiRow>
          <UiEmpty v-if="!quar.length" compact icon="i-lucide-archive" title="Không có lô biệt trữ" />
        </UiGroup>

        <div v-if="q && seg === 'tat-ca' && !byGroup.length" class="rounded-group bg-default">
          <UiEmpty compact icon="i-lucide-search-x" :title="`Không thấy &quot;${q}&quot;`" description="Thử tên vật tư, mã (VT002) hoặc số lô in trên tem." />
        </div>
      </div>
    </section>

    <section class="scroll-pane min-w-0 lg:overflow-y-auto" :class="!detailOpen && 'hidden lg:block'">
      <NuxtPage />
    </section>
  </div>
</template>
