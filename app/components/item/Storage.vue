<script setup lang="ts">
import type { Storage } from '~/types'
import { STORAGE } from '~/data/catalog'

/** Storage condition. Room temperature is the default and stays silent unless asked for. */
const props = defineProps<{ bq: Storage, always?: boolean }>()
const s = computed(() => STORAGE[props.bq])
</script>

<template>
  <span
    v-if="bq !== 'phong' || always"
    class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-caption font-semibold whitespace-nowrap"
    :class="bq === 'phong' ? 'bg-(--fill) text-muted' : 'bg-info/10 text-info'"
    :title="`${s.label}, ${s.range}`"
  >
    <UIcon :name="s.icon" class="size-3.5" aria-hidden="true" />
    {{ s.range }}
  </span>
</template>
