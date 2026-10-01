<script setup lang="ts">
import { item } from '~/data/catalog'
import { fold } from '~/utils/format'

useHead({ title: 'Nhập kho' })

type Seg = 'dang-xu-ly' | 'da-nhap'
const route = useRoute()
const { receipts } = useStore()
const seg = useState<Seg>('nk-seg', () => 'dang-xu-ly')
const q = ref('')
const term = computed(() => fold(q.value.trim()))

const segments = computed(() => [
  { label: 'Đang xử lý', value: 'dang-xu-ly' as Seg, count: receipts.value.filter(r => r.stage < 3).length },
  { label: 'Đã nhập kho', value: 'da-nhap' as Seg }
])
const list = computed(() => receipts.value
  .filter(r => (seg.value === 'da-nhap' ? r.stage === 3 : r.stage < 3))
  .filter(r => !term.value || fold(`${r.so} ${r.ncc} ${r.hoaDon} ${r.lines.map(l => `${item(l.ma).ten} ${l.so}`).join(' ')}`).includes(term.value)))
const detailOpen = computed(() => !!route.params.so)
</script>

<template>
  <div class="lg:grid lg:h-dvh lg:grid-cols-[minmax(360px,420px)_minmax(0,1fr)]">
    <section class="scroll-pane min-w-0 lg:overflow-y-auto lg:border-r lg:border-(--hairline)" :class="detailOpen && 'hidden lg:block'" aria-label="Danh sách phiếu nhập">
      <AppPageHeader title="Nhập kho" subtitle="Hàng từ nhà cung cấp, theo hợp đồng năm 2026">
        <template #below>
          <UiSegmented v-model="seg" :options="segments" label="Lọc phiếu nhập" class="mt-4" />
          <UInput v-model="q" icon="i-lucide-search" placeholder="Tìm nhà cung cấp, hóa đơn, số lô" aria-label="Tìm phiếu nhập" class="mt-3 w-full" />
        </template>
      </AppPageHeader>
      <div class="px-4 pb-10 lg:px-8">
        <UiGroup>
          <ReceiptRow v-for="r in list" :key="r.so" :receipt="r" :selected="route.params.so === r.so" inline-action />
          <UiEmpty v-if="!list.length" compact icon="i-lucide-truck" :title="q ? 'Không có phiếu nhập khớp' : 'Không có hàng đang chờ nhập'" />
        </UiGroup>
      </div>
    </section>
    <section class="scroll-pane min-w-0 lg:overflow-y-auto" :class="!detailOpen && 'hidden lg:block'">
      <NuxtPage />
    </section>
  </div>
</template>
