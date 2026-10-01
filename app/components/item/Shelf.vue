<script setup lang="ts">
import { shelfText, shelfTone, toneMark, toneText } from '~/utils/format'

/**
 * Shelf-life bar: how much of a year of shelf life is left. Normal lots stay grey;
 * only lots under 90 days take color, so the eye goes straight to what must leave first.
 */
const props = withDefaults(defineProps<{ days: number, text?: boolean, width?: number, quarantined?: boolean }>(), { text: true, width: 56 })
const tone = computed(() => props.quarantined ? 'neutral' : shelfTone(props.days))
const fill = computed(() => props.days <= 0 ? 0 : Math.max(0.06, Math.min(1, props.days / 365)))
</script>

<template>
  <span class="inline-flex items-center gap-2">
    <span class="relative h-1.5 shrink-0 overflow-hidden rounded-full bg-(--fill)" :style="{ width: `${width}px` }" aria-hidden="true">
      <span class="absolute inset-y-0 left-0 rounded-full" :class="toneMark[tone]" :style="{ width: `${fill * 100}%` }" />
    </span>
    <span v-if="text" class="text-footnote font-medium whitespace-nowrap tabular" :class="tone === 'neutral' ? 'text-muted' : toneText[tone]">{{ shelfText(days) }}</span>
  </span>
</template>
