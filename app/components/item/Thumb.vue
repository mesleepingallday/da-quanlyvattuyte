<script setup lang="ts">
import type { Item } from '~/types'
import { NHOM_ICON, item as getItem } from '~/data/catalog'

/** Product photo on a soft tile. Falls back to the category symbol when an item has no photo. */
const props = withDefaults(defineProps<{
  item: Item | string
  size?: number
  /** Describe the image (hero use); thumbnails next to a name stay decorative */
  alt?: string
  eager?: boolean
  /** White card with a soft shadow instead of the grey tile (welcome hero) */
  card?: boolean
}>(), { size: 48 })

const it = computed(() => typeof props.item === 'string' ? getItem(props.item) : props.item)
const base = computed(() => it.value.img ? `/images/vat-tu/${it.value.img}` : undefined)
const radius = computed(() => Math.round(props.size * 0.24))
</script>

<template>
  <div
    class="isolate shrink-0 overflow-hidden"
    :class="card ? 'bg-default shadow-float' : 'bg-(--tile)'"
    :style="{ width: `${size}px`, height: `${size}px`, borderRadius: `${radius}px` }"
  >
    <img
      v-if="base"
      :src="`${base}.webp`"
      :srcset="`${base}-160.webp 160w, ${base}.webp 640w`"
      :sizes="`${size}px`"
      :alt="alt ?? ''"
      :loading="eager ? 'eager' : 'lazy'"
      decoding="async"
      draggable="false"
      class="size-full object-contain"
      :class="size >= 120 ? 'p-[7%]' : 'p-[9%]'"
    >
    <div v-else class="flex size-full items-center justify-center">
      <UIcon :name="NHOM_ICON[it.nhom] ?? 'i-lucide-package'" class="size-1/2 text-muted" aria-hidden="true" />
    </div>
  </div>
</template>
