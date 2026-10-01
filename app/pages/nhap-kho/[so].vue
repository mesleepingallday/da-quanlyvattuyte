<script setup lang="ts">
import type { ReceiptEvent, Step } from '~/types'
import { item } from '~/data/catalog'
import { person } from '~/data/people'
import { RECEIPT_ACTION_DONE, RECEIPT_ACTION_LABEL, RECEIPT_STEPS, myReceiptAction, priceIssues, receiptStatus, receiptValue } from '~/utils/slip'
import { ago, daysUntil, fd, money, nf, when } from '~/utils/format'

definePageMeta({ task: true })

const route = useRoute()
const so = computed(() => String(route.params.so))
const store = useStore()
const { user } = useSession()
const toast = useToast()

const r = computed(() => store.findReceipt(so.value))
useHead({ title: () => so.value })

const status = computed(() => r.value ? receiptStatus(r.value) : null)
const action = computed(() => r.value ? myReceiptAction(r.value, user.value) : null)
const issues = computed(() => r.value ? priceIssues(r.value) : [])
const editable = computed(() => r.value?.stage === 0 && user.value?.role === 'kho')
const failedNoReason = computed(() => r.value?.lines.some(l => !l.dat && !l.ghiChu?.trim()) ?? false)
const blocked = computed(() => action.value === 'send' && (issues.value.length > 0 || failedNoReason.value))

const STEP_EVENT: ReceiptEvent['kind'][] = ['kiem-nhap', 'ke-toan', 'ky', 'nhap-kho']
const steps = computed<Step[]>(() => RECEIPT_STEPS.map((s, i) => {
  const stage = r.value?.stage ?? 0
  const state: Step['state'] = i < stage || stage === 3 ? 'done' : i === stage ? 'current' : 'todo'
  const ev = state === 'done' ? r.value?.events.find(e => e.kind === STEP_EVENT[i]) : undefined
  return { label: s.label, state, by: ev?.by, at: ev?.at }
}))

const VERB: Record<ReceiptEvent['kind'], string> = {
  'nhan': 'nhận hàng từ nhà cung cấp',
  'kiem-nhap': 'hoàn tất kiểm nhập, chuyển kế toán',
  'ke-toan': 'xác nhận hóa đơn và lập phiếu nhập',
  'ky': 'ký duyệt nhập kho',
  'nhap-kho': 'đưa hàng vào kho'
}

const pct = (gia: number, hd: number) => `${gia > hd ? '+' : ''}${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(((gia - hd) / hd) * 100)}%`

function setDat(idx: number, dat: boolean) {
  store.setLineResult(so.value, idx, dat)
}
function setReason(idx: number, text: string) {
  store.setLineResult(so.value, idx, false, text)
}
function acceptContractPrice(idx: number) {
  const undo = store.correctPrice(so.value, idx)
  toast.add({ title: 'Đã áp giá hợp đồng cho dòng này', description: 'Ghi chú: nhà cung cấp đồng ý xuất lại hóa đơn theo giá hợp đồng.', icon: 'i-lucide-circle-check', color: 'success', actions: [{ label: 'Hoàn tác', color: 'neutral', variant: 'soft', size: 'sm', onClick: () => undo() }] })
}

function run() {
  const a = action.value
  const u = user.value
  if (!a || !u || blocked.value) return
  const undo = { send: store.sendToAccounting, check: store.accountingOk, sign: store.signReceipt }[a](so.value, u.key)
  toast.add({
    title: RECEIPT_ACTION_DONE[a],
    description: a === 'sign' ? 'Lô đạt đã vào kho; lô không đạt nằm ở khu biệt trữ.' : undefined,
    icon: 'i-lucide-circle-check',
    color: 'success',
    actions: [{ label: 'Hoàn tác', color: 'neutral', variant: 'soft', size: 'sm', onClick: () => { undo(); toast.add({ title: 'Đã hoàn tác', icon: 'i-lucide-undo-2', color: 'neutral' }) } }]
  })
}
</script>

<template>
  <div v-if="r && status">
    <AppPageHeader :title="r.ncc.replace(/^Công ty (CP|TNHH)\s*/, '')" back="/nhap-kho" back-label="Nhập kho" back-mobile-only width="880px">
      <template #subtitle>
        <span class="tabular">{{ r.so }}</span>, nhận {{ ago(r.at).toLowerCase() }}
      </template>
    </AppPageHeader>

    <div class="mx-auto max-w-[880px] space-y-6 px-4 pb-32 lg:px-8 lg:pb-12">
      <section class="rounded-group bg-default p-5" aria-label="Tình trạng phiếu nhập">
        <UiStatus :status="status" size="md" />
        <UiSteps :steps="steps" class="mt-6" />

        <UAlert
          v-if="issues.length && r.stage < 3"
          class="mt-6"
          color="error"
          variant="subtle"
          icon="i-lucide-octagon-alert"
          :title="`${issues.length} dòng có giá hóa đơn khác giá hợp đồng`"
          description="Chưa được chuyển kế toán cho đến khi giá khớp hợp đồng. Liên hệ nhà cung cấp để xuất lại hóa đơn."
        />

        <div
          v-if="action"
          class="glass fixed inset-x-0 bottom-0 z-30 flex flex-col gap-2 border-t border-(--hairline) px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:static lg:mt-6 lg:flex-row lg:items-center lg:justify-end lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-filter-none"
        >
          <p v-if="blocked" class="text-footnote text-muted lg:me-auto">
            {{ issues.length ? 'Xử lý dòng giá lệch hợp đồng trước khi chuyển.' : 'Ghi lý do cho dòng không đạt trước khi chuyển.' }}
          </p>
          <UButton :label="RECEIPT_ACTION_LABEL[action]" :icon="action === 'sign' ? 'i-lucide-signature' : 'i-lucide-check'" size="lg" class="justify-center" :disabled="blocked" @click="run" />
        </div>
      </section>

      <UiGroup title="Hóa đơn và hợp đồng">
        <dl>
          <div
            v-for="row in [['Nhà cung cấp', r.ncc], ['Hợp đồng', r.hd], ['Hóa đơn', r.hoaDon], ['Ngày nhận', fd(r.at)], ['Người nhận', person(r.by).name]]"
            :key="row[0]"
            class="relative flex items-baseline justify-between gap-4 px-4 py-3 after:absolute after:right-0 after:bottom-0 after:left-4 after:h-px after:bg-(--hairline) last:after:hidden"
          >
            <dt class="shrink-0 text-[15px] text-muted">
              {{ row[0] }}
            </dt>
            <dd class="text-right text-[15px] text-highlighted">
              {{ row[1] }}
            </dd>
          </div>
        </dl>
      </UiGroup>

      <UiGroup title="Kiểm nhập" :count="r.lines.length" :footer="editable ? 'Dòng không đạt sẽ vào khu biệt trữ khi nhập kho, không được cấp phát.' : undefined">
        <div
          v-for="(l, idx) in r.lines"
          :key="l.so"
          class="relative px-4 py-4 after:absolute after:right-0 after:bottom-0 after:left-[88px] after:h-px after:bg-(--hairline) last:after:hidden"
        >
          <div class="flex gap-4">
            <ItemThumb :item="l.ma" :size="56" />
            <div class="min-w-0 flex-1">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="text-headline text-highlighted">
                    {{ item(l.ma).ten }}
                  </p>
                  <div class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span class="text-footnote text-muted tabular">Lô {{ l.so }}, HSD {{ fd(l.hsd) }}</span>
                    <ItemShelf :days="daysUntil(l.hsd)" :width="40" :text="false" />
                  </div>
                </div>
                <p class="shrink-0 text-right">
                  <span class="text-title-3 text-highlighted tabular">{{ nf(l.sl) }}</span>
                  <span class="block text-footnote text-muted">{{ item(l.ma).dvt.toLowerCase() }}</span>
                </p>
              </div>

              <div class="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-footnote tabular">
                <span :class="l.gia !== l.giaHd ? 'font-semibold text-error' : 'text-muted'">
                  Giá hóa đơn {{ money(l.gia) }}
                </span>
                <span class="text-muted">Giá hợp đồng {{ money(l.giaHd) }}</span>
                <span v-if="l.gia !== l.giaHd" class="inline-flex items-center gap-1 font-semibold text-error">
                  <UIcon name="i-lucide-octagon-alert" class="size-4" aria-hidden="true" />Lệch {{ pct(l.gia, l.giaHd) }}
                </span>
              </div>
              <UButton
                v-if="l.gia !== l.giaHd && editable"
                class="mt-2"
                size="sm"
                color="neutral"
                variant="soft"
                label="NCC đồng ý giá hợp đồng"
                @click="acceptContractPrice(idx)"
              />

              <div class="mt-3 flex flex-wrap items-center gap-3">
                <USwitch
                  :model-value="l.dat"
                  :disabled="!editable"
                  :label="l.dat ? 'Đạt' : 'Không đạt, đưa vào biệt trữ'"
                  :ui="{ label: l.dat ? 'text-[15px] text-default font-medium' : 'text-[15px] text-warning font-medium' }"
                  @update:model-value="setDat(idx, $event)"
                />
              </div>
              <UInput
                v-if="!l.dat && editable"
                :model-value="l.ghiChu ?? ''"
                placeholder="Lý do không đạt, ví dụ: hộp móp, ẩm"
                aria-label="Lý do không đạt"
                class="mt-2 w-full"
                @update:model-value="setReason(idx, String($event))"
              />
              <p v-else-if="!l.dat && l.ghiChu" class="mt-1.5 text-footnote text-muted">
                {{ l.ghiChu }}
              </p>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between border-t border-(--hairline) px-4 py-3.5">
          <span class="text-callout text-muted">Giá trị theo hóa đơn</span>
          <span class="text-headline text-highlighted tabular">{{ money(receiptValue(r)) }}</span>
        </div>
      </UiGroup>

      <UiGroup title="Nhật ký">
        <ol class="px-4 py-2">
          <li v-for="(e, i) in r.events" :key="i" class="relative flex gap-3 py-2.5">
            <span v-if="i < r.events.length - 1" class="absolute top-11 bottom-0 left-[15px] w-0.5 rounded-full bg-(--fill-strong)" aria-hidden="true" />
            <UiAvatar :who="e.by" :size="32" />
            <div class="min-w-0 flex-1">
              <p class="text-[15px]/5 text-default">
                <span class="font-semibold text-highlighted">{{ person(e.by).name }}</span> {{ VERB[e.kind] }}
              </p>
              <p class="mt-0.5 text-footnote text-muted tabular">
                {{ when(e.at) }}
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
    <UiEmpty icon="i-lucide-file-question" :title="`Không tìm thấy ${so}`" description="Phiếu nhập có thể đã bị xóa.">
      <UButton label="Về nhập kho" to="/nhap-kho" color="neutral" variant="soft" />
    </UiEmpty>
  </div>
</template>
