<script setup lang="ts">
import type { Slip } from '~/types'
import type { SlipAction } from '~/utils/slip'
import { ACTION_DONE, myAction } from '~/utils/slip'
import { item } from '~/data/catalog'
import { KHOA } from '~/data/people'
import { dayGroup, fold } from '~/utils/format'

useHead({ title: 'Phiếu lĩnh' })

type Seg = 'can-xu-ly' | 'dang-xu-ly' | 'da-xong'

const route = useRoute()
const { user, role } = useSession()
const { visible, slipTasks } = useTasks()
const store = useStore()
const toast = useToast()

const seg = useState<Seg>('phieu-seg', () => 'can-xu-ly')
watch(() => route.query.loc, (v) => { if (v) seg.value = v as Seg }, { immediate: true })
// Nothing to do → open on what is moving instead of an empty tab
onMounted(() => { if (!route.query.loc && seg.value === 'can-xu-ly' && !slipTasks.value.length) seg.value = 'dang-xu-ly' })

const q = ref('')
const khoa = ref<string>('Tất cả khoa')
const seeAllDepts = computed(() => role.value === 'kho' || role.value === 'vt' || role.value === 'kt')

const segments = computed(() => [
  { label: 'Cần xử lý', value: 'can-xu-ly' as Seg, count: slipTasks.value.length },
  { label: 'Đang xử lý', value: 'dang-xu-ly' as Seg },
  { label: 'Đã xong', value: 'da-xong' as Seg }
])

function inSeg(s: Slip) {
  const a = myAction(s, user.value)
  if (seg.value === 'can-xu-ly') return !!a
  if (seg.value === 'dang-xu-ly') return !a && !s.rejected && s.stage >= 1 && s.stage <= 4
  return !a && (s.stage === 5 || !!s.rejected)
}

const term = computed(() => fold(q.value.trim()))
const list = computed(() => {
  const base = seg.value === 'can-xu-ly' ? slipTasks.value : visible.value
  return base.filter(s => inSeg(s)
    && (khoa.value === 'Tất cả khoa' || s.khoa === khoa.value)
    && (!term.value || fold(`${s.so} ${s.khoa} ${s.lines.map(l => item(l.ma).ten).join(' ')}`).includes(term.value)))
})

const limit = ref(40)
watch([seg, q, khoa], () => { limit.value = 40 })

/** "Cần xử lý" is a work queue (oldest first, no dates); the rest read like a mailbox */
const groups = computed(() => {
  const shown = list.value.slice(0, limit.value)
  if (seg.value === 'can-xu-ly') return [{ label: '', slips: shown }]
  const out: { label: string, slips: Slip[] }[] = []
  for (const s of shown) {
    const g = dayGroup(s.at)
    const last = out[out.length - 1]
    if (last?.label === g) last.slips.push(s)
    else out.push({ label: g, slips: [s] })
  }
  return out
})

const detailOpen = computed(() => !!route.params.so)

/* ---------- Select several and approve together ---------- */
const BULK: SlipAction[] = ['approve-dept', 'confirm', 'approve']
const selecting = ref(false)
const picked = ref<string[]>([])
const canBulk = computed(() => seg.value === 'can-xu-ly' && list.value.some(s => BULK.includes(myAction(s, user.value)!)))
const bulkAction = computed(() => {
  const s = list.value.find(x => picked.value.includes(x.so))
  return s ? myAction(s, user.value) : null
})
watch([seg, canBulk], () => { if (!canBulk.value) selecting.value = false; picked.value = [] })

function toggle(so: string, on: boolean) {
  picked.value = on ? [...new Set([...picked.value, so])] : picked.value.filter(x => x !== so)
}

function bulkRun() {
  const u = user.value
  const a = bulkAction.value
  if (!u || !a) return
  const fn = { 'approve-dept': store.approveDept, 'confirm': store.confirm, 'approve': store.approve }[a as 'approve-dept' | 'confirm' | 'approve']
  const undos = picked.value.map(so => fn(so, u.key))
  const n = undos.length
  picked.value = []
  selecting.value = false
  toast.add({
    title: `${ACTION_DONE[a]} ${n} phiếu`,
    icon: 'i-lucide-circle-check',
    color: 'success',
    actions: [{ label: 'Hoàn tác', color: 'neutral', variant: 'soft', size: 'sm', onClick: () => { undos.reverse().forEach(u => u()); toast.add({ title: 'Đã hoàn tác', icon: 'i-lucide-undo-2', color: 'neutral' }) } }]
  })
}
</script>

<template>
  <div class="lg:grid lg:h-dvh lg:grid-cols-[minmax(360px,420px)_minmax(0,1fr)]">
    <section
      class="scroll-pane min-w-0 lg:overflow-y-auto lg:border-r lg:border-(--hairline)"
      :class="detailOpen && 'hidden lg:block'"
      aria-label="Danh sách phiếu lĩnh"
    >
      <AppPageHeader title="Phiếu lĩnh">
        <template #actions>
          <UButton
            v-if="canBulk"
            :label="selecting ? 'Xong' : 'Chọn'"
            color="primary"
            variant="ghost"
            @click="selecting = !selecting; picked = []"
          />
          <UButton v-if="role === 'dd'" icon="i-lucide-square-pen" to="/lap-phieu" color="primary" variant="ghost" square aria-label="Lập phiếu lĩnh" />
        </template>
        <template #below>
          <UiSegmented v-model="seg" :options="segments" label="Lọc phiếu theo trạng thái" class="mt-4" />
          <div class="mt-3 flex gap-2">
            <UInput v-model="q" icon="i-lucide-search" placeholder="Tìm phiếu" aria-label="Tìm theo số phiếu, khoa hoặc vật tư" class="min-w-0 flex-1" />
            <USelect
              v-if="seeAllDepts"
              v-model="khoa"
              :items="['Tất cả khoa', ...KHOA]"
              aria-label="Lọc theo khoa"
              class="w-36 shrink-0"
            />
          </div>
        </template>
      </AppPageHeader>

      <div class="space-y-6 px-4 pb-10 lg:px-8">
        <template v-if="list.length">
          <UiGroup v-for="g in groups" :key="g.label || 'queue'" :title="g.label || undefined">
            <SlipRow
              v-for="s in g.slips"
              :key="s.so"
              :slip="s"
              :selected="route.params.so === s.so"
              :inline-action="!selecting"
              :selectable="selecting && BULK.includes(myAction(s, user)!)"
              :checked="picked.includes(s.so)"
              @update:checked="toggle(s.so, $event)"
            />
          </UiGroup>
          <UButton
            v-if="list.length > limit"
            :label="`Xem thêm ${Math.min(40, list.length - limit)} phiếu`"
            color="neutral"
            variant="soft"
            block
            @click="limit += 40"
          />
        </template>
        <div v-else class="rounded-group bg-default">
          <UiEmpty
            v-if="q || khoa !== 'Tất cả khoa'"
            compact
            icon="i-lucide-search-x"
            title="Không có phiếu khớp"
            description="Thử số phiếu khác, tên khoa hoặc tên vật tư."
          >
            <UButton label="Xóa bộ lọc" color="neutral" variant="soft" @click="q = ''; khoa = 'Tất cả khoa'" />
          </UiEmpty>
          <UiEmpty
            v-else-if="seg === 'can-xu-ly'"
            compact
            icon="i-lucide-check-check"
            title="Không có phiếu nào chờ bạn"
            description="Phiếu cần bạn xử lý sẽ hiện ở đây."
          />
          <UiEmpty v-else compact icon="i-lucide-clipboard-list" title="Chưa có phiếu" :description="role === 'dd' ? 'Phiếu bạn gửi sẽ hiện ở đây.' : 'Phiếu các khoa gửi sẽ hiện ở đây.'">
            <UButton v-if="role === 'dd'" label="Lập phiếu lĩnh" to="/lap-phieu" />
          </UiEmpty>
        </div>
      </div>

      <Transition enter-from-class="translate-y-4 opacity-0" leave-to-class="translate-y-4 opacity-0" enter-active-class="transition duration-200" leave-active-class="transition duration-150">
        <div
          v-if="selecting && picked.length"
          class="glass glass-edge fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+88px)] z-40 mx-auto flex max-w-md items-center gap-3 rounded-full p-1.5 ps-5 shadow-float lg:bottom-6 lg:left-[calc(264px+1.5rem)] lg:mx-0 lg:w-[360px]"
          role="region"
          aria-label="Thao tác với các phiếu đã chọn"
        >
          <span class="flex-1 text-[15px] font-semibold text-highlighted tabular">Đã chọn {{ picked.length }}</span>
          <UButton v-if="bulkAction" :label="`${bulkAction === 'confirm' ? 'Xác nhận' : 'Duyệt'} ${picked.length} phiếu`" @click="bulkRun" />
        </div>
      </Transition>
    </section>

    <section class="scroll-pane min-w-0 lg:overflow-y-auto" :class="!detailOpen && 'hidden lg:block'">
      <NuxtPage />
    </section>
  </div>
</template>
