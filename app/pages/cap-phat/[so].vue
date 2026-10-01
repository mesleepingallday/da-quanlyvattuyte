<script setup lang="ts">
import type { Pick } from '~/types'
import { allocate } from '~/composables/useStore'
import { item } from '~/data/catalog'
import { daysUntil, fd, nf, place } from '~/utils/format'

definePageMeta({ task: true })

const route = useRoute()
const so = String(route.params.so)
useHead({ title: `Cấp phát ${so}` })

const store = useStore()
const { user } = useSession()
const toast = useToast()

const slip = computed(() => store.findSlip(so))
const allowed = computed(() => user.value?.role === 'kho' && slip.value?.stage === 4 && !slip.value.rejected)

/** The pick list is fixed when the screen opens, so it does not shift while someone walks the shelves */
const plan = (slip.value?.lines ?? []).map((l) => {
  const { picks, short } = allocate(store.lots.value, l.ma, l.sl)
  return { ma: l.ma, sl: l.sl, short, picks: picks.map(p => ({ ...p, lot: store.lots.value.find(x => x.so === p.so && x.ma === l.ma)! })) }
})
const keyOf = (ma: string, lot: string) => `${ma}|${lot}`
const taken = ref<Record<string, boolean>>({})
const totalPicks = plan.reduce((a, p) => a + p.picks.length, 0)
const doneCount = computed(() => Object.values(taken.value).filter(Boolean).length)
const complete = computed(() => doneCount.value === totalPicks)

/* ---------- Scanning ---------- */
const code = ref('')
const feedback = ref<{ tone: 'ok' | 'warning' | 'critical', title: string, text?: string } | null>(null)

function parse(raw: string) {
  const s = raw.trim().toUpperCase().replace(/\s+/g, '')
  return s.match(/\(10\)([A-Z0-9-]+)/)?.[1] ?? s.match(/^01\d{14}(?:17\d{6})?10([A-Z0-9-]+)$/)?.[1] ?? s
}

function scan() {
  const lotNo = parse(code.value)
  code.value = ''
  if (!lotNo) return
  for (const p of plan) {
    const pick = p.picks.find(x => x.so === lotNo)
    if (pick) {
      taken.value[keyOf(p.ma, lotNo)] = true
      feedback.value = { tone: 'ok', title: `Đúng lô ${lotNo}`, text: `Lấy ${nf(pick.sl)} ${item(p.ma).dvt.toLowerCase()} ${item(p.ma).ten}.` }
      return
    }
  }
  const lot = store.lots.value.find(l => l.so === lotNo)
  if (!lot) {
    feedback.value = { tone: 'warning', title: `Không thấy lô ${lotNo}`, text: 'Kiểm tra lại số lô trên tem.' }
  } else if (daysUntil(lot.hsd) <= 0) {
    feedback.value = { tone: 'critical', title: `Lô ${lotNo} đã hết hạn`, text: 'Không cấp phát. Để lô này sang khu biệt trữ chờ hủy.' }
  } else if (lot.q) {
    feedback.value = { tone: 'critical', title: `Lô ${lotNo} đang biệt trữ`, text: lot.qLyDo }
  } else if (plan.some(p => p.ma === lot.ma)) {
    const want = plan.find(p => p.ma === lot.ma)!.picks[0]!
    feedback.value = { tone: 'warning', title: `Chưa đến lượt lô ${lotNo}`, text: `Theo FEFO, lấy lô ${want.so} (HSD ${fd(want.lot.hsd)}, ${place(want.lot.viTri)}) trước.` }
  } else {
    feedback.value = { tone: 'warning', title: `Lô ${lotNo} không thuộc phiếu này`, text: `Đây là ${item(lot.ma).ten}, phiếu không có vật tư này.` }
  }
}

/* ---------- Finish ---------- */
const issued = ref(false)
let undo: (() => void) | null = null

function finish() {
  if (!slip.value || !user.value || !complete.value) return
  const picks: Record<string, Pick[]> = Object.fromEntries(plan.map(p => [p.ma, p.picks.map(x => ({ so: x.so, sl: x.sl }))]))
  undo = store.issue(so, user.value.key, picks)
  issued.value = true
}
function undoIssue() {
  undo?.()
  issued.value = false
  taken.value = {}
  toast.add({ title: 'Đã hoàn tác cấp phát', description: 'Tồn kho đã trả lại như trước.', icon: 'i-lucide-undo-2', color: 'neutral' })
}
</script>

<template>
  <!-- Done -->
  <div v-if="issued && slip" class="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
    <div class="flex size-20 animate-pop items-center justify-center rounded-full bg-(--mark-green) text-white shadow-float">
      <UIcon name="i-lucide-check" class="size-11" aria-hidden="true" />
    </div>
    <h1 class="mt-6 text-title-2 text-highlighted" role="status">
      Đã cấp phát {{ so }}
    </h1>
    <p class="mt-2 max-w-sm text-[15px]/6 text-muted">
      {{ slip.khoa }}, {{ slip.lines.length }} mặt hàng. Tồn kho đã trừ theo từng lô. In chứng từ để người nhận ký.
    </p>
    <div class="mt-8 flex w-full max-w-sm flex-col gap-2">
      <UButton label="In chứng từ xuất kho" icon="i-lucide-printer" size="xl" block :to="`/in/${so}`" />
      <UButton label="Về Hôm nay" color="neutral" variant="soft" size="xl" block to="/" />
      <UButton label="Hoàn tác cấp phát" color="neutral" variant="link" class="mt-1 text-muted" @click="undoIssue" />
    </div>
  </div>

  <div v-else-if="slip && allowed">
    <AppPageHeader :title="`Cấp phát ${so}`" :subtitle="`${slip.khoa}, ${slip.lines.length} mặt hàng`" :back="`/phieu/${so}`" back-label="Phiếu" width="820px" />

    <div class="mx-auto max-w-[820px] space-y-6 px-4 pb-36 lg:px-8 lg:pb-16">
      <section class="rounded-group bg-default p-4" aria-label="Quét lô">
        <form class="flex gap-2" @submit.prevent="scan">
          <UInput
            v-model="code"
            autofocus
            icon="i-lucide-scan-barcode"
            placeholder="Quét tem lô, hoặc gõ số lô rồi Enter"
            aria-label="Quét hoặc nhập số lô"
            class="flex-1"
            autocomplete="off"
            autocapitalize="characters"
            spellcheck="false"
            size="lg"
          />
          <UButton type="submit" label="Xác nhận lô" color="neutral" variant="soft" size="lg" class="hidden sm:inline-flex" />
        </form>
        <UAlert
          v-if="feedback"
          class="mt-3"
          :color="feedback.tone === 'ok' ? 'success' : feedback.tone === 'warning' ? 'warning' : 'error'"
          variant="subtle"
          :icon="feedback.tone === 'ok' ? 'i-lucide-circle-check' : feedback.tone === 'warning' ? 'i-lucide-triangle-alert' : 'i-lucide-octagon-alert'"
          :title="feedback.title"
          :description="feedback.text"
          aria-live="assertive"
        />
        <div class="mt-4 flex items-center gap-3">
          <UProgress :model-value="doneCount" :max="totalPicks" size="sm" class="flex-1" :aria-label="`Đã lấy ${doneCount} trên ${totalPicks} lô`" />
          <span class="text-footnote font-semibold text-muted tabular">{{ doneCount }}/{{ totalPicks }} lô</span>
        </div>
      </section>

      <UiGroup v-for="p in plan" :key="p.ma">
        <template #header>
          <div class="flex min-w-0 items-center gap-3">
            <ItemThumb :item="p.ma" :size="40" />
            <div class="min-w-0">
              <h2 class="truncate text-headline text-highlighted">
                {{ item(p.ma).ten }}
              </h2>
              <p class="text-footnote text-muted tabular">
                Duyệt {{ nf(p.sl) }} {{ item(p.ma).dvt.toLowerCase() }}
              </p>
            </div>
          </div>
        </template>

        <label
          v-for="x in p.picks"
          :key="x.so"
          class="relative flex cursor-pointer items-center gap-4 px-4 py-3.5 transition-colors after:absolute after:right-0 after:bottom-0 after:left-4 after:h-px after:bg-(--hairline) last:after:hidden hover:bg-(--fill)/50"
          :class="taken[keyOf(p.ma, x.so)] && 'bg-primary/6'"
        >
          <UCheckbox
            :model-value="!!taken[keyOf(p.ma, x.so)]"
            size="xl"
            :aria-label="`Đã lấy lô ${x.so}`"
            @update:model-value="taken[keyOf(p.ma, x.so)] = !!$event"
          />
          <div class="w-24 shrink-0">
            <p class="text-footnote text-muted">
              Vị trí
            </p>
            <p class="text-headline text-highlighted tabular">
              {{ x.lot.viTri }}
            </p>
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-[15px]/5 font-medium text-highlighted tabular">
              Lô {{ x.so }}
            </p>
            <div class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <ItemShelf :days="daysUntil(x.lot.hsd)" :width="44" />
              <span class="text-footnote text-muted tabular">HSD {{ fd(x.lot.hsd) }}</span>
            </div>
          </div>
          <p class="shrink-0 text-right">
            <span class="text-title-3 text-highlighted tabular">{{ nf(x.sl) }}</span>
            <span class="block text-footnote text-muted">{{ item(p.ma).dvt.toLowerCase() }}</span>
          </p>
        </label>

        <div v-if="p.short" class="flex gap-2.5 border-t border-(--hairline) px-4 py-3 text-callout text-warning">
          <UIcon name="i-lucide-triangle-alert" class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>Thiếu {{ nf(p.short) }} {{ item(p.ma).dvt.toLowerCase() }}: kho không đủ lô còn hạn. Phát phần có và báo khoa.</span>
        </div>
      </UiGroup>

      <p class="px-4 text-footnote text-muted">
        Lô được xếp theo hạn dùng: lấy lô hết hạn trước (FEFO). Lô hết hạn hoặc đang biệt trữ không bao giờ có trong danh sách lấy hàng.
      </p>

      <div class="glass fixed inset-x-0 bottom-0 z-30 border-t border-(--hairline) px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:static lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-filter-none">
        <div class="mx-auto flex max-w-[820px] items-center gap-3">
          <p class="min-w-0 flex-1 text-footnote text-muted">
            {{ complete ? 'Đã lấy đủ hàng.' : `Còn ${totalPicks - doneCount} lô chưa lấy.` }}
          </p>
          <UButton label="Hoàn tất cấp phát" icon="i-lucide-package-check" size="lg" :disabled="!complete" @click="finish" />
        </div>
      </div>
    </div>
  </div>

  <div v-else class="flex min-h-[60dvh] items-center justify-center">
    <UiEmpty
      icon="i-lucide-package-x"
      :title="slip ? `${so} chưa thể cấp phát` : `Không tìm thấy ${so}`"
      :description="slip ? 'Chỉ thủ kho cấp phát, và chỉ khi phiếu đã được P.VTTBYT duyệt.' : 'Phiếu có thể đã bị xóa.'"
    >
      <UButton :label="slip ? 'Xem phiếu' : 'Về danh sách phiếu'" :to="slip ? `/phieu/${so}` : '/phieu'" color="neutral" variant="soft" />
    </UiEmpty>
  </div>
</template>
