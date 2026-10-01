<script setup lang="ts">
import type { SlipStatus } from '~/utils/slip'
import { toneText } from '~/utils/format'

/**
 * Status label: a tinted symbol plus words. Only critical states color the words too,
 * so a list of waiting slips stays calm (color is never the only signal).
 */
const props = defineProps<{ status: SlipStatus, size?: 'sm' | 'md' }>()
const iconTone = computed(() => props.status.tone === 'neutral' ? 'text-dimmed' : toneText[props.status.tone])
</script>

<template>
  <span class="inline-flex min-w-0 items-center gap-1.5 font-medium" :class="size === 'md' ? 'text-[15px]/5' : 'text-footnote'">
    <UIcon :name="status.icon" class="shrink-0" :class="[iconTone, size === 'md' ? 'size-[18px]' : 'size-4']" aria-hidden="true" />
    <span class="truncate" :class="status.tone === 'critical' ? 'text-error' : 'text-muted'">{{ status.label }}</span>
  </span>
</template>
