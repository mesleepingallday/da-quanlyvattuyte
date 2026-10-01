<script setup lang="ts">
import { nf } from '~/utils/format'

/** Usable stock against the minimum. The tick marks the minimum; the bar turns orange below it. */
const props = defineProps<{ total: number, min: number, dvt: string, align?: 'start' | 'end' }>()
const fill = computed(() => Math.min(1, props.total / Math.max(1, props.min * 2)))
const tone = computed(() => props.total === 0 ? 'bg-(--mark-red)' : props.total < props.min ? 'bg-(--mark-orange)' : 'bg-(--mark-gray)')
</script>

<template>
  <div class="inline-flex flex-col gap-1" :class="align === 'end' ? 'items-end' : 'items-start'">
    <span class="whitespace-nowrap">
      <span class="text-headline text-highlighted tabular">{{ nf(total) }}</span>
      <span class="ms-1 text-footnote text-muted">{{ dvt.toLowerCase() }}</span>
    </span>
    <span class="relative h-1.5 w-16 rounded-full bg-(--fill)" :title="`Tối thiểu ${nf(min)} ${dvt.toLowerCase()}`" aria-hidden="true">
      <span class="absolute inset-y-0 left-0 rounded-full" :class="tone" :style="{ width: `${fill * 100}%` }" />
      <span class="absolute -top-0.5 -bottom-0.5 left-1/2 w-0.5 rounded-full bg-(--ui-text-dimmed)" />
    </span>
  </div>
</template>
