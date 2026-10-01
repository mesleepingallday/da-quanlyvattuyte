<script setup lang="ts">
import type { StockInfo } from '~/composables/useInventory'
import { place } from '~/utils/format'

/** An item in the stock list: what it is, how much is usable, which lot leaves next */
const props = defineProps<{ info: StockInfo, selected?: boolean }>()
const it = computed(() => props.info.item)
</script>

<template>
  <UiRow :to="`/kho/${it.ma}`" :selected="selected" :inset="80">
    <template #leading>
      <ItemThumb :item="it" :size="52" />
    </template>
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <p class="line-clamp-2 text-headline text-highlighted">
          {{ it.ten }}
        </p>
        <p class="truncate text-callout text-muted tabular">
          {{ it.ma }}, {{ place(it.viTri) }}
        </p>
      </div>
      <ItemStock :total="info.total" :min="it.tonMin" :dvt="it.dvt" align="end" class="shrink-0" />
    </div>
    <div class="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
      <ItemShelf v-if="info.nearestDays !== undefined" :days="info.nearestDays" :width="44" />
      <span v-else class="text-footnote font-medium text-error">Không còn lô dùng được</span>
      <span v-if="info.expired" class="inline-flex items-center gap-1 text-footnote font-medium text-error">
        <UIcon name="i-lucide-octagon-alert" class="size-3.5" aria-hidden="true" />Có lô hết hạn
      </span>
      <span v-if="info.quarantined" class="inline-flex items-center gap-1 text-footnote font-medium text-muted">
        <UIcon name="i-lucide-archive-x" class="size-3.5" aria-hidden="true" />Có lô biệt trữ
      </span>
      <ItemStorage :bq="it.bq" />
    </div>
  </UiRow>
</template>
