<script setup lang="ts">
import type { Attention } from '~/composables/useInventory'
import { nf, place } from '~/utils/format'

/** A lot or item that needs someone to act: expired, expiring, below minimum or out of stock */
const props = defineProps<{ a: Attention }>()
const unit = computed(() => props.a.item.dvt.toLowerCase())
const to = computed(() => ({ path: `/kho/${props.a.item.ma}`, query: props.a.lot ? { lo: props.a.lot.so } : {} }))
</script>

<template>
  <UiRow :to="to" :inset="76" chevron>
    <template #leading>
      <ItemThumb :item="a.item" :size="48" />
    </template>
    <div class="truncate text-headline text-highlighted">
      {{ a.item.ten }}
    </div>
    <template v-if="a.lot">
      <div class="truncate text-callout text-muted tabular">
        Lô {{ a.lot.so }}, {{ nf(a.lot.sl) }} {{ unit }}, {{ place(a.lot.viTri) }}
      </div>
      <div class="mt-1.5">
        <ItemShelf :days="a.days ?? 0" />
      </div>
    </template>
    <template v-else>
      <div class="truncate text-callout text-muted tabular">
        Tồn {{ nf(a.info.total) }} {{ unit }}, tối thiểu {{ nf(a.item.tonMin) }}
      </div>
      <div class="mt-1.5 inline-flex items-center gap-1.5 text-footnote font-medium" :class="a.kind === 'out' ? 'text-error' : 'text-warning'">
        <UIcon :name="a.kind === 'out' ? 'i-lucide-package-x' : 'i-lucide-trending-down'" class="size-4" aria-hidden="true" />
        {{ a.kind === 'out' ? 'Hết hàng' : 'Dưới tồn tối thiểu' }}
      </div>
    </template>
  </UiRow>
</template>
