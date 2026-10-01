<script setup lang="ts">
import type { TableColumn, TimelineItem } from '@nuxt/ui'
import type { PhieuItem, PhieuStatus } from '~/types'
import { P, STEPS, STEP_P } from '~/data/sample'
import { fd, money, nf, pad } from '~/utils/format'

const props = defineProps<{ slipId: number | null }>()
const open = defineModel<boolean>('open', { default: false })

const { slips, setStatus } = useSlips()
const toast = useToast()

const slip = computed(() => slips.value.find(s => s.n === props.slipId) ?? null)

const num = { class: { th: 'text-right', td: 'text-right' } }
const itemColumns: TableColumn<PhieuItem>[] = [
  { id: 'vt', header: 'Vật tư' },
  { id: 'lot', header: 'Lô FEFO' },
  { id: 'req', header: 'SL yêu cầu', meta: num },
  { id: 'out', header: 'SL phát', meta: num }
]

const progress: Record<PhieuStatus, number> = { N: 0, W: 3, A: 4, D: 5, R: 3 }

const timeline = computed<TimelineItem[]>(() => {
  const s = slip.value
  if (!s) return []
  const prog = progress[s.st]
  const hhmm = (i: number) => pad((s.hh + i) % 24) + ':' + pad((s.mm + i * 9) % 60)
  return STEPS.map((label, i) => {
    const p = P[i === 0 ? s.lan : STEP_P[i]!]
    let c: 'done' | 'cur' | 'bad' | 'todo' = i < prog ? 'done' : i === prog ? (s.st === 'R' ? 'bad' : 'cur') : 'todo'
    if (s.st === 'N' && i === 0) c = 'cur'
    let when: string
    if (c === 'done') {
      const d = new Date(s.date)
      d.setDate(d.getDate() + Math.floor(i / 2))
      when = fd(d) + ' · ' + hhmm(i)
    } else if (c === 'cur') when = 'Đang chờ'
    else if (c === 'bad') when = 'Đã từ chối · ' + fd(s.date)
    else when = 'Chưa đến'
    return {
      value: i,
      title: c === 'bad' ? label + ' (từ chối)' : label,
      description: `${p.n} · ${p.r}`,
      date: when,
      icon: c === 'done' ? 'i-lucide-check' : c === 'bad' ? 'i-lucide-x' : undefined,
      ui: c === 'bad'
        ? { indicator: 'bg-error text-inverted', title: 'text-error' }
        : c === 'todo' ? { title: 'text-muted font-normal' } : undefined
    } satisfies TimelineItem
  })
})
// items before the active one render as completed; a finished slip has no active step
const activeStep = computed(() => {
  const s = slip.value
  return s ? progress[s.st] : 0
})

function approve() {
  const s = slip.value
  if (!s) return
  setStatus(s.n, 'A')
  toast.add({ title: 'Đã duyệt ' + s.no, icon: 'i-lucide-check', color: 'success' })
}
function issue() {
  const s = slip.value
  if (!s) return
  setStatus(s.n, 'D')
  toast.add({ title: 'Đã cấp phát ' + s.no, icon: 'i-lucide-check', color: 'success' })
}

const rejectOpen = ref(false)
const reason = ref('')
function confirmReject() {
  const s = slip.value
  if (!s || !reason.value.trim()) return
  setStatus(s.n, 'R')
  toast.add({ title: 'Đã từ chối ' + s.no, description: reason.value.trim(), icon: 'i-lucide-check', color: 'success' })
  rejectOpen.value = false
  reason.value = ''
}
</script>

<template>
  <USlideover
    v-model:open="open"
    side="right"
    :description="slip ? `Chi tiết phiếu · ${slip.khoa}` : undefined"
    :ui="{ content: 'sm:max-w-lg w-full', footer: 'justify-end' }"
  >
    <template #title>
      <span class="flex items-center gap-2.5">
        <span class="font-mono text-lg">{{ slip?.no }}</span>
        <SlipsStatusBadge v-if="slip" :status="slip.st" />
      </span>
    </template>

    <template #body>
      <div v-if="slip" class="space-y-6">
        <dl class="grid grid-cols-3 gap-3 rounded-lg border border-default p-3">
          <div>
            <dt class="text-xs text-muted">
              Ngày lập
            </dt>
            <dd class="mt-0.5 font-mono font-medium tabular-nums text-highlighted">
              {{ fd(slip.date) }}
            </dd>
          </div>
          <div>
            <dt class="text-xs text-muted">
              Số mặt hàng
            </dt>
            <dd class="mt-0.5 font-mono font-medium tabular-nums text-highlighted">
              {{ slip.items.length }}
            </dd>
          </div>
          <div>
            <dt class="text-xs text-muted">
              Giá trị
            </dt>
            <dd class="mt-0.5 font-mono font-medium tabular-nums text-highlighted">
              {{ money(slip.value) }}
            </dd>
          </div>
        </dl>

        <section>
          <h3 class="mb-2 text-sm font-semibold text-highlighted">
            Vật tư
          </h3>
          <UTable :data="slip.items" :columns="itemColumns" :ui="{ th: 'px-2', td: 'px-2' }">
            <template #vt-cell="{ row }">
              <div class="text-highlighted">
                {{ row.original.v.ten }}
              </div>
              <div class="text-xs text-muted">
                {{ row.original.v.dvt }}
              </div>
            </template>
            <template #lot-cell="{ row }">
              <UBadge
                v-if="row.original.lot"
                :label="row.original.lot.so"
                color="neutral"
                variant="outline"
                class="font-mono"
              />
              <span v-else class="text-dimmed">—</span>
            </template>
            <template #req-cell="{ row }">
              <span class="font-mono tabular-nums">{{ nf(row.original.req) }}</span>
            </template>
            <template #out-cell="{ row }">
              <span v-if="slip.st === 'D'" class="font-mono tabular-nums">{{ nf(row.original.req) }}</span>
              <span v-else class="text-dimmed">—</span>
            </template>
          </UTable>
        </section>

        <section>
          <h3 class="mb-3 text-sm font-semibold text-highlighted">
            Tiến trình phê duyệt
          </h3>
          <UTimeline
            :items="timeline"
            :model-value="activeStep"
            size="xs"
            color="success"
            :ui="{ date: 'order-last mt-0.5' }"
          />
        </section>
      </div>
    </template>

    <template #footer="{ close }">
      <template v-if="slip?.st === 'W'">
        <UButton label="Từ chối" color="error" variant="outline" size="lg" @click="rejectOpen = true" />
        <UButton label="Duyệt" size="lg" @click="approve" />
      </template>
      <template v-else-if="slip?.st === 'A'">
        <UButton label="Từ chối" color="error" variant="outline" size="lg" @click="rejectOpen = true" />
        <UButton label="Cấp phát" size="lg" @click="issue" />
      </template>
      <UButton v-else label="Đóng" color="neutral" variant="outline" size="lg" @click="close" />
    </template>
  </USlideover>

  <UModal
    v-model:open="rejectOpen"
    :title="`Từ chối ${slip?.no ?? ''}`"
    description="Nhập lý do từ chối để người lập phiếu biết."
  >
    <template #body>
      <UTextarea
        v-model="reason"
        placeholder="Lý do từ chối"
        :rows="4"
        autofocus
        class="w-full"
        aria-label="Lý do từ chối"
      />
    </template>
    <template #footer="{ close }">
      <UButton label="Hủy" color="neutral" variant="outline" @click="close" />
      <UButton label="Từ chối phiếu" color="error" :disabled="!reason.trim()" @click="confirmReject" />
    </template>
  </UModal>
</template>
