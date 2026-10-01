<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { SlipEvent } from '~/types'
import { ACTION_LABEL, canSee, myAction, slipStatus, slipValue, waitingOn } from '~/utils/slip'
import { allocate } from '~/composables/useStore'
import { item } from '~/data/catalog'
import { person, ROLE_LABEL } from '~/data/people'
import { ago, daysUntil, money, nf, place, waited, when } from '~/utils/format'

definePageMeta({ task: true })

const route = useRoute()
const so = computed(() => String(route.params.so))
const { findSlip, lots, deleteDraft } = useStore()
const { user } = useSession()
const { stockOf } = useInventory()
const { run, openReject, openReturn } = useSlipActions()
const toast = useToast()

const slip = computed(() => {
  const s = findSlip(so.value)
  return s && canSee(s, user.value) ? s : undefined
})
useHead({ title: () => so.value })

const status = computed(() => slip.value ? slipStatus(slip.value) : null)
const action = computed(() => slip.value ? myAction(slip.value, user.value) : null)
const waiting = computed(() => slip.value ? waitingOn(slip.value) : null)
const lastEvent = computed(() => slip.value?.events[slip.value.events.length - 1])

const lines = computed(() => (slip.value?.lines ?? []).map((l) => {
  const it = item(l.ma)
  const st = stockOf(l.ma)
  const plan = allocate(lots.value, l.ma, l.sl)
  const first = plan.picks[0] ? lots.value.find(x => x.so === plan.picks[0]!.so) : undefined
  return { l, it, st, plan, first, short: slip.value!.stage < 5 && l.sl > st.total }
}))

const VERB: Record<SlipEvent['kind'], string> = {
  'tao': 'tạo nháp',
  'gui': 'gửi phiếu',
  'duyet-khoa': 'duyệt, với vai trò trưởng khoa',
  'xac-nhan': 'xác nhận kho đủ hàng',
  'duyet': 'duyệt, với vai trò P.VTTBYT',
  'cap-phat': 'cấp phát và in chứng từ',
  'tra-lai': 'trả lại khoa',
  'tu-choi': 'từ chối',
  'sua': 'sửa phiếu'
}

const menu = computed<DropdownMenuItem[]>(() => {
  const s = slip.value
  if (!s) return []
  const items: DropdownMenuItem[] = []
  if (s.stage === 5) items.push({ label: 'In chứng từ xuất kho', icon: 'i-lucide-printer', to: `/in/${s.so}` })
  if (user.value?.role === 'dd' && s.by === user.value.key) items.push({ label: 'Lĩnh lại như phiếu này', icon: 'i-lucide-repeat-2', to: { path: '/lap-phieu', query: { tu: s.so } } })
  items.push({ label: 'Sao chép số phiếu', icon: 'i-lucide-copy', onSelect: () => { navigator.clipboard?.writeText(s.so); toast.add({ title: `Đã sao chép ${s.so}`, icon: 'i-lucide-copy', color: 'neutral' }) } })
  return items
})

function removeDraft() {
  const s = slip.value
  if (!s) return
  const undo = deleteDraft(s.so)
  navigateTo('/phieu')
  toast.add({ title: `Đã xóa nháp ${s.so}`, icon: 'i-lucide-trash-2', color: 'neutral', actions: [{ label: 'Hoàn tác', color: 'neutral', variant: 'soft', size: 'sm', onClick: () => undo() }] })
}
</script>

<template>
  <div v-if="slip && status">
    <AppPageHeader :title="slip.khoa" back="/phieu" back-label="Phiếu lĩnh" back-mobile-only width="880px">
      <template #subtitle>
        <span class="tabular">{{ slip.so }}</span>, {{ person(slip.by).name }} gửi {{ ago(slip.at).toLowerCase() }}
      </template>
      <template #actions>
        <UDropdownMenu :items="menu" :content="{ align: 'end' }">
          <UButton icon="i-lucide-ellipsis" color="neutral" variant="ghost" square aria-label="Thêm thao tác" />
        </UDropdownMenu>
      </template>
    </AppPageHeader>

    <div class="mx-auto max-w-[880px] space-y-6 px-4 pb-32 lg:px-8 lg:pb-12">
      <section class="rounded-group bg-default p-5" aria-label="Tình trạng phiếu">
        <div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <UiStatus :status="status" size="md" />
          <p v-if="waiting && status.kind === 'waiting' && lastEvent" class="text-footnote text-muted">
            Đã chờ {{ waited(lastEvent.at) }}
          </p>
        </div>
        <p v-if="waiting?.who && status.kind === 'waiting'" class="mt-1 text-callout text-muted">
          Đang chờ {{ person(waiting.who).name }} ({{ ROLE_LABEL[waiting.role] }})
        </p>

        <SlipProgress :slip="slip" variant="full" class="mt-6" />

        <UAlert
          v-if="slip.rejected"
          class="mt-6"
          color="error"
          variant="subtle"
          icon="i-lucide-message-square-warning"
          :title="`${person(slip.rejected.by).name} từ chối ${ago(slip.rejected.at).toLowerCase()}`"
          :description="slip.rejected.reason"
        />
        <UAlert
          v-else-if="slip.returned && slip.stage === 0"
          class="mt-6"
          color="warning"
          variant="subtle"
          icon="i-lucide-undo-2"
          :title="`Kho trả lại ${ago(slip.returned.at).toLowerCase()}`"
          :description="slip.returned.reason"
        />

        <!-- Actions: inline on desktop, a bar above the home indicator on phones -->
        <div
          v-if="action || slip.stage === 5"
          class="glass fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-(--hairline) px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:static lg:mt-6 lg:justify-end lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-filter-none"
        >
          <template v-if="action === 'send'">
            <UButton label="Xóa" color="error" variant="soft" size="lg" class="justify-center" @click="removeDraft" />
            <UButton label="Sửa" color="neutral" variant="soft" size="lg" class="flex-1 justify-center lg:flex-none" :to="{ path: '/lap-phieu', query: { nhap: slip.so } }" />
            <UButton :label="ACTION_LABEL.send" size="lg" class="flex-1 justify-center lg:flex-none" @click="run('send', slip)" />
          </template>
          <template v-else-if="action === 'approve-dept' || action === 'approve'">
            <UButton label="Từ chối" color="error" variant="soft" size="lg" class="flex-1 justify-center lg:flex-none" @click="openReject(slip)" />
            <UButton label="Duyệt" icon="i-lucide-check" size="lg" class="flex-1 justify-center lg:flex-none" @click="run(action, slip)" />
          </template>
          <template v-else-if="action === 'confirm'">
            <UButton label="Trả lại khoa" color="neutral" variant="soft" size="lg" class="flex-1 justify-center lg:flex-none" @click="openReturn(slip)" />
            <UButton label="Xác nhận" icon="i-lucide-check" size="lg" class="flex-1 justify-center lg:flex-none" @click="run('confirm', slip)" />
          </template>
          <UButton v-else-if="action === 'issue'" label="Cấp phát" icon="i-lucide-package-check" size="lg" class="flex-1 justify-center lg:flex-none" @click="run('issue', slip)" />
          <UButton v-else-if="action === 'fix'" :label="ACTION_LABEL.fix" icon="i-lucide-square-pen" size="lg" class="flex-1 justify-center lg:flex-none" @click="run('fix', slip)" />
          <UButton v-else-if="slip.stage === 5" label="In chứng từ xuất kho" icon="i-lucide-printer" color="neutral" variant="soft" size="lg" class="flex-1 justify-center lg:flex-none" :to="`/in/${slip.so}`" />
        </div>
      </section>

      <div v-if="slip.note" class="flex gap-3 rounded-group bg-default p-4">
        <UiAvatar :who="slip.by" :size="32" />
        <div class="min-w-0">
          <p class="text-footnote text-muted">
            Ghi chú của {{ person(slip.by).name }}
          </p>
          <p class="mt-0.5 text-[15px]/6 text-highlighted">
            {{ slip.note }}
          </p>
        </div>
      </div>

      <UiGroup title="Vật tư" :count="slip.lines.length">
        <div
          v-for="x in lines"
          :key="x.l.ma"
          class="relative flex gap-4 px-4 py-4 after:absolute after:right-0 after:bottom-0 after:left-[88px] after:h-px after:bg-(--hairline) last:after:hidden"
        >
          <NuxtLink :to="`/kho/${x.it.ma}`" class="shrink-0 rounded-[14px]" :aria-label="`Xem ${x.it.ten} trong tồn kho`">
            <ItemThumb :item="x.it" :size="56" />
          </NuxtLink>
          <div class="min-w-0 flex-1">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="text-headline text-highlighted">
                  {{ x.it.ten }}
                </p>
                <p class="text-callout text-muted">
                  {{ x.it.quyCach }}
                </p>
              </div>
              <p class="shrink-0 text-right">
                <span class="text-title-3 text-highlighted tabular">{{ nf(x.l.sl) }}</span>
                <span class="ms-1 text-footnote text-muted">{{ x.it.dvt.toLowerCase() }}</span>
              </p>
            </div>

            <!-- Issued: what actually left the shelf -->
            <div v-if="slip.stage === 5 && x.l.picks?.length" class="mt-2 space-y-1">
              <p v-for="p in x.l.picks" :key="p.so" class="flex items-center gap-1.5 text-footnote text-muted tabular">
                <UIcon name="i-lucide-package-check" class="size-4 text-success" aria-hidden="true" />
                Đã phát lô {{ p.so }}: {{ nf(p.sl) }} {{ x.it.dvt.toLowerCase() }}
              </p>
            </div>

            <!-- Still open: stock and the lot FEFO will take -->
            <div v-else-if="!slip.rejected" class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
              <span class="text-footnote font-medium tabular" :class="x.short ? 'text-warning' : 'text-muted'">
                <UIcon v-if="x.short" name="i-lucide-triangle-alert" class="me-1 size-4 align-[-3px]" aria-hidden="true" />
                Kho còn {{ nf(x.st.total) }} {{ x.it.dvt.toLowerCase() }}{{ x.short ? `, thiếu ${nf(x.l.sl - x.st.total)}` : '' }}
              </span>
              <span v-if="x.first" class="inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-footnote text-muted tabular">
                <span class="whitespace-nowrap">Lô {{ x.first.so }}, {{ place(x.first.viTri) }}</span>
                <ItemShelf :days="daysUntil(x.first.hsd)" :width="40" />
              </span>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between border-t border-(--hairline) px-4 py-3.5">
          <span class="text-callout text-muted">Giá trị ước tính</span>
          <span class="text-headline text-highlighted tabular">{{ money(slipValue(slip)) }}</span>
        </div>
        <template v-if="slip.stage < 5 && !slip.rejected" #footer>
          Lô được chọn theo hạn dùng: hết hạn trước, xuất trước (FEFO). Thủ kho xác nhận lại khi cấp phát.
        </template>
      </UiGroup>

      <UiGroup title="Nhật ký">
        <ol class="px-4 py-2">
          <li v-for="(e, i) in slip.events" :key="i" class="relative flex gap-3 py-2.5">
            <span v-if="i < slip.events.length - 1" class="absolute top-11 bottom-0 left-[15px] w-0.5 rounded-full bg-(--fill-strong)" aria-hidden="true" />
            <UiAvatar :who="e.by" :size="32" />
            <div class="min-w-0 flex-1">
              <p class="text-[15px]/5 text-default">
                <span class="font-semibold text-highlighted">{{ person(e.by).name }}</span> {{ VERB[e.kind] }}
              </p>
              <p class="mt-0.5 text-footnote text-muted tabular">
                <time :datetime="e.at">{{ when(e.at) }}</time>
              </p>
              <p v-if="e.note" class="mt-1.5 rounded-xl bg-(--fill)/70 px-3 py-2 text-callout text-default">
                {{ e.note }}
              </p>
            </div>
          </li>
        </ol>
      </UiGroup>
    </div>
  </div>

  <div v-else class="flex min-h-[60dvh] items-center justify-center">
    <UiEmpty icon="i-lucide-file-question" :title="`Không tìm thấy ${so}`" description="Phiếu có thể đã bị xóa, hoặc thuộc khoa khác.">
      <UButton label="Về danh sách phiếu" to="/phieu" color="neutral" variant="soft" />
    </UiEmpty>
  </div>
</template>
