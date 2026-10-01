<script setup lang="ts">
import type { Item } from '~/types'
import { ITEMS, item } from '~/data/catalog'
import { fold, money, nf } from '~/utils/format'

definePageMeta({ task: true })

const route = useRoute()
const router = useRouter()
const { user } = useSession()
const store = useStore()
const { stockOf } = useInventory()
const toast = useToast()

/** ?tu= copies a slip (lĩnh lại, or fixing a rejected one); ?nhap= edits a draft */
const from = computed(() => typeof route.query.tu === 'string' ? store.findSlip(route.query.tu) : undefined)
const draft = computed(() => {
  const s = typeof route.query.nhap === 'string' ? store.findSlip(route.query.nhap) : undefined
  return s && s.stage === 0 && s.by === user.value?.key ? s : undefined
})
useHead({ title: () => draft.value ? `Sửa ${draft.value.so}` : 'Lập phiếu lĩnh' })

interface Line { ma: string, sl: number }
const lines = ref<Line[]>([])
const note = ref('')

const source = draft.value ?? from.value
if (source) {
  lines.value = source.lines.map(l => ({ ma: l.ma, sl: l.sl }))
  note.value = from.value?.rejected ? '' : source.note ?? ''
}
const initial = JSON.stringify({ lines: lines.value, note: note.value })
const dirty = computed(() => JSON.stringify({ lines: lines.value, note: note.value }) !== initial)

const khoa = computed(() => user.value?.dept ?? '')
const deptSlips = computed(() => store.slips.value.filter(s => s.khoa === khoa.value && !s.rejected && s.stage >= 1))

/** What the department usually asks for, most frequent first */
const frequent = computed(() => {
  const count = new Map<string, number>()
  for (const s of deptSlips.value) for (const l of s.lines) count.set(l.ma, (count.get(l.ma) ?? 0) + 1)
  return [...count.entries()].sort((a, b) => b[1] - a[1]).map(([ma]) => item(ma)).filter(it => !lines.value.some(l => l.ma === it.ma)).slice(0, 6)
})

/** The quantity this department asked for last time, as a starting point */
function lastQty(ma: string) {
  for (const s of deptSlips.value) {
    const l = s.lines.find(x => x.ma === ma)
    if (l) return l.sl
  }
  return undefined
}
const stepOf = (it: Item) => it.dungTB >= 500 ? 50 : it.dungTB >= 50 ? 10 : 1

const q = ref('')
const results = computed(() => {
  const t = fold(q.value.trim())
  if (!t) return []
  return ITEMS.filter(it => !lines.value.some(l => l.ma === it.ma) && fold(`${it.ten} ${it.ma} ${it.nhom}`).includes(t)).slice(0, 6)
})

function add(it: Item) {
  lines.value.push({ ma: it.ma, sl: lastQty(it.ma) ?? stepOf(it) })
  q.value = ''
}
function remove(i: number) {
  lines.value.splice(i, 1)
}

const total = computed(() => lines.value.reduce((a, l) => a + l.sl * item(l.ma).gia, 0))
const ready = computed(() => lines.value.length > 0 && lines.value.every(l => l.sl > 0))

function finish(send: boolean) {
  const u = user.value
  if (!u || !ready.value) return
  let so: string
  if (draft.value) {
    store.updateDraft(draft.value.so, lines.value, note.value)
    so = draft.value.so
    if (send) store.submit(so, u.key)
  } else {
    so = store.createSlip({ by: u.key, khoa: khoa.value, lines: lines.value, note: note.value, send }).so
  }
  toast.add({
    title: send ? `Đã gửi ${so}` : `Đã lưu nháp ${so}`,
    description: send ? 'Đang chờ trưởng khoa duyệt. Bạn sẽ thấy phiếu đi qua từng bước.' : 'Nháp nằm trong mục Cần xử lý cho đến khi bạn gửi.',
    icon: 'i-lucide-circle-check',
    color: 'success'
  })
  leaving.value = true
  router.replace(`/phieu/${so}`)
}

/* Leaving with unsaved changes asks first (Apple's "discard changes?") */
const leaving = ref(false)
const confirmOpen = ref(false)
let pendingTo: string | null = null
onBeforeRouteLeave((to) => {
  if (leaving.value || !dirty.value) return true
  pendingTo = to.fullPath
  confirmOpen.value = true
  return false
})
function discard() {
  leaving.value = true
  confirmOpen.value = false
  router.push(pendingTo ?? '/phieu')
}
function cancel() {
  router.push(source ? `/phieu/${source.so}` : '/')
}
</script>

<template>
  <div v-if="user && user.role !== 'dd'" class="flex min-h-[60dvh] items-center justify-center">
    <UiEmpty icon="i-lucide-lock" title="Phiếu lĩnh do điều dưỡng khoa lập" description="Vai trò của bạn duyệt hoặc cấp phát phiếu, không lập phiếu mới.">
      <UButton label="Về Hôm nay" to="/" color="neutral" variant="soft" />
    </UiEmpty>
  </div>
  <div v-else-if="user">
    <AppPageHeader :title="draft ? `Sửa ${draft.so}` : 'Phiếu lĩnh mới'" :subtitle="`${khoa}, lĩnh tại kho chính`" width="760px">
      <template #leading>
        <UButton label="Hủy" color="primary" variant="link" class="-ms-1 px-1 text-[16px] font-medium" @click="cancel" />
      </template>
    </AppPageHeader>

    <div class="mx-auto max-w-[760px] space-y-6 px-4 pb-36 lg:px-8 lg:pb-16">
      <UAlert
        v-if="from?.rejected"
        color="error"
        variant="subtle"
        icon="i-lucide-message-square-warning"
        :title="`${from.so} bị từ chối, sửa rồi gửi lại`"
        :description="from.rejected.reason"
      />
      <UAlert
        v-else-if="from && !draft"
        color="neutral"
        variant="subtle"
        icon="i-lucide-repeat-2"
        :title="`Đã chép vật tư từ ${from.so}`"
        description="Kiểm tra số lượng trước khi gửi. Phiếu mới có số riêng."
      />

      <UiGroup title="Vật tư" :count="lines.length || undefined">
        <div class="p-3">
          <UInput
            v-model="q"
            icon="i-lucide-plus"
            placeholder="Thêm vật tư: gõ tên hoặc mã"
            aria-label="Thêm vật tư"
            class="w-full"
            @keydown.enter.prevent="results[0] && add(results[0])"
          />
        </div>

        <div v-if="results.length" class="border-t border-(--hairline)">
          <UiRow v-for="it in results" :key="it.ma" button :inset="76" dense @click="add(it)">
            <template #leading>
              <ItemThumb :item="it" :size="44" />
            </template>
            <div class="truncate text-headline text-highlighted">
              {{ it.ten }}
            </div>
            <div class="truncate text-footnote text-muted tabular">
              {{ it.ma }}, kho còn {{ nf(stockOf(it.ma).total) }} {{ it.dvt.toLowerCase() }}
            </div>
            <template #trailing>
              <UIcon name="i-lucide-circle-plus" class="size-6 text-primary" aria-hidden="true" />
            </template>
          </UiRow>
        </div>
        <p v-else-if="q.trim()" class="border-t border-(--hairline) px-4 py-4 text-callout text-muted">
          Không có vật tư "{{ q }}" trong danh mục.
        </p>

        <div v-else-if="frequent.length" class="border-t border-(--hairline) px-3 pt-3 pb-3.5">
          <p class="mb-2 px-1 text-footnote text-muted">
            {{ khoa }} thường lĩnh
          </p>
          <div class="no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3">
            <button
              v-for="it in frequent"
              :key="it.ma"
              type="button"
              class="flex shrink-0 items-center gap-2 rounded-full bg-(--fill) py-1 ps-1 pe-3.5 text-[14px] font-medium text-highlighted transition-colors hover:bg-(--fill-strong)"
              @click="add(it)"
            >
              <ItemThumb :item="it" :size="28" class="rounded-full!" />
              {{ it.ten }}
            </button>
          </div>
        </div>

        <TransitionGroup tag="div" move-class="transition-transform duration-300" enter-from-class="opacity-0 -translate-y-1" enter-active-class="transition duration-200" leave-active-class="transition duration-150 absolute inset-x-0" leave-to-class="opacity-0" class="relative">
          <div
            v-for="(l, i) in lines"
            :key="l.ma"
            class="relative flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-(--hairline) bg-default px-4 py-3.5 sm:flex-nowrap"
          >
            <ItemThumb :item="l.ma" :size="52" />
            <div class="min-w-0 flex-1">
              <p class="text-headline text-highlighted">
                {{ item(l.ma).ten }}
              </p>
              <p
                class="mt-0.5 text-footnote font-medium tabular"
                :class="l.sl > stockOf(l.ma).total ? 'text-warning' : 'text-muted'"
              >
                <template v-if="l.sl > stockOf(l.ma).total">
                  Kho chỉ còn {{ nf(stockOf(l.ma).total) }} {{ item(l.ma).dvt.toLowerCase() }}. Phiếu vẫn gửi được; kho sẽ báo nếu thiếu.
                </template>
                <template v-else>
                  Kho còn {{ nf(stockOf(l.ma).total) }} {{ item(l.ma).dvt.toLowerCase() }}<template v-if="lastQty(l.ma)">, lần trước khoa lĩnh {{ nf(lastQty(l.ma)!) }}</template>
                </template>
              </p>
            </div>
            <div class="flex w-full items-center justify-end gap-2 sm:w-auto">
              <UInputNumber
                v-model="l.sl"
                :min="1"
                :step="stepOf(item(l.ma))"
                :aria-label="`Số lượng ${item(l.ma).ten}`"
                class="w-36"
                :increment="{ color: 'neutral', variant: 'ghost', size: 'sm', square: true }"
                :decrement="{ color: 'neutral', variant: 'ghost', size: 'sm', square: true }"
              />
              <span class="w-10 text-footnote text-muted">{{ item(l.ma).dvt.toLowerCase() }}</span>
              <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="sm" square :aria-label="`Bỏ ${item(l.ma).ten}`" class="text-muted" @click="remove(i)" />
            </div>
          </div>
        </TransitionGroup>

        <p v-if="!lines.length" class="border-t border-(--hairline) px-4 py-6 text-center text-callout text-muted">
          Chưa có vật tư. Gõ tên vào ô phía trên hoặc chọn từ danh sách thường lĩnh.
        </p>
      </UiGroup>

      <UiGroup title="Ghi chú">
        <div class="p-3">
          <UTextarea v-model="note" :rows="2" autoresize placeholder="Lý do lĩnh hoặc y lệnh, nếu có" aria-label="Ghi chú" class="w-full" />
        </div>
      </UiGroup>

      <div class="glass fixed inset-x-0 bottom-0 z-30 border-t border-(--hairline) px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:static lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-filter-none">
        <div class="mx-auto flex max-w-[760px] flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
          <p class="min-w-0 flex-1 text-footnote text-muted tabular sm:text-callout">
            <span class="font-semibold text-highlighted">{{ lines.length }} mặt hàng</span>, ước tính {{ money(total) }}
          </p>
          <div class="flex gap-2">
            <UButton label="Lưu nháp" color="neutral" variant="soft" size="lg" class="flex-1 justify-center sm:flex-none" :disabled="!ready" @click="finish(false)" />
            <UButton label="Gửi duyệt" icon="i-lucide-send" size="lg" class="flex-1 justify-center sm:flex-none" :disabled="!ready" @click="finish(true)" />
          </div>
        </div>
      </div>
    </div>

    <UiSheet v-model:open="confirmOpen" title="Bỏ phiếu đang soạn?" description="Vật tư và ghi chú bạn vừa nhập sẽ mất.">
      <template #footer>
        <UButton label="Tiếp tục soạn" color="neutral" variant="soft" size="lg" class="justify-center" @click="confirmOpen = false" />
        <UButton label="Bỏ phiếu" color="error" size="lg" class="justify-center" @click="discard" />
      </template>
    </UiSheet>
  </div>
</template>
