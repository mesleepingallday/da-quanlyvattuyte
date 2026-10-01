<script setup lang="ts">
import type { Receipt } from '~/types'
import { myReceiptAction, priceIssues, receiptStatus } from '~/utils/slip'
import { whenShort } from '~/utils/format'

/** A goods receipt in a list. Inline button opens it: receipts are always reviewed, never approved blind. */
const props = defineProps<{ receipt: Receipt, selected?: boolean, inlineAction?: boolean }>()
const { user } = useSession()

const action = computed(() => myReceiptAction(props.receipt, user.value))
const status = computed(() => receiptStatus(props.receipt))
const issues = computed(() => priceIssues(props.receipt).length)
const failed = computed(() => props.receipt.lines.filter(l => !l.dat).length)
const OPEN_LABEL = { send: 'Kiểm nhập', check: 'Kiểm tra', sign: 'Xem và ký' } as const
const supplier = computed(() => props.receipt.ncc.replace(/^Công ty (CP|TNHH)\s*/, ''))
</script>

<template>
  <div
    class="relative flex min-w-0 items-center gap-3 px-4 py-3 transition-colors after:pointer-events-none after:absolute after:right-0 after:bottom-0 after:left-[86px] after:h-px after:bg-(--hairline) last:after:hidden has-[a:hover]:bg-(--fill)/50 has-[a:active]:bg-(--fill)"
    :class="selected && 'bg-primary/10 has-[a:hover]:bg-primary/12'"
  >
    <ItemThumbs :mas="receipt.lines.map(l => l.ma)" :size="44" />
    <div class="min-w-0 flex-1">
      <div class="flex items-baseline justify-between gap-3">
        <NuxtLink
          :to="`/nhap-kho/${receipt.so}`"
          class="truncate text-headline text-highlighted outline-none before:absolute before:inset-0 before:content-[''] focus-visible:before:ring-2 focus-visible:before:ring-primary focus-visible:before:ring-inset"
          :aria-current="selected ? 'page' : undefined"
        >
          {{ supplier }}<span class="sr-only">, {{ receipt.so }}, {{ status.label }}</span>
        </NuxtLink>
        <time class="shrink-0 text-footnote text-muted tabular" :datetime="receipt.at">{{ whenShort(receipt.at) }}</time>
      </div>
      <p class="truncate text-callout text-muted tabular">
        {{ receipt.so }}, {{ receipt.lines.length }} mặt hàng
      </p>
      <div class="mt-1.5 flex min-h-6 items-center justify-between gap-3">
        <div class="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
          <UiStatus :status="status" />
          <span v-if="issues && receipt.stage < 3" class="inline-flex items-center gap-1 text-footnote font-medium text-error">
            <UIcon name="i-lucide-octagon-alert" class="size-4" aria-hidden="true" />{{ issues }} giá lệch hợp đồng
          </span>
          <span v-if="failed && receipt.stage < 3" class="inline-flex items-center gap-1 text-footnote font-medium text-warning">
            <UIcon name="i-lucide-archive-x" class="size-4" aria-hidden="true" />{{ failed }} không đạt
          </span>
        </div>
        <UButton
          v-if="inlineAction && action"
          :to="`/nhap-kho/${receipt.so}`"
          :label="OPEN_LABEL[action]"
          size="sm"
          class="relative z-10 shrink-0"
        />
      </div>
    </div>
  </div>
</template>
