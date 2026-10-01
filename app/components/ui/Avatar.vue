<script setup lang="ts">
import type { Person } from '~/types'
import { person } from '~/data/people'

/** Monogram avatar. Each person keeps one hue everywhere so faces become recognisable in timelines. */
const props = withDefaults(defineProps<{ who: string | Person, size?: number, ring?: boolean }>(), { size: 32 })
const p = computed(() => typeof props.who === 'string' ? person(props.who) : props.who)
</script>

<template>
  <span
    class="inline-flex shrink-0 items-center justify-center rounded-full bg-[oklch(0.93_0.045_var(--h))] font-semibold text-[oklch(0.42_0.09_var(--h))] select-none dark:bg-[oklch(0.38_0.07_var(--h))] dark:text-[oklch(0.92_0.05_var(--h))]"
    :class="ring && 'ring-2 ring-(--ui-bg)'"
    :style="{ '--h': p.hue, width: `${size}px`, height: `${size}px`, fontSize: `${Math.round(size * 0.38)}px` }"
    :title="`${p.name}, ${p.title}`"
    aria-hidden="true"
  >{{ p.initials }}</span>
</template>
