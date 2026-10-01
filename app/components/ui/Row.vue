<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

/**
 * One row of a grouped list. Draws its own hairline, inset to where the text starts (Apple style),
 * and hides it on the last row.
 */
const props = withDefaults(defineProps<{
  to?: RouteLocationRaw
  title?: string
  subtitle?: string
  /** Separator inset in px from the left edge */
  inset?: number
  chevron?: boolean
  selected?: boolean
  /** Render as a button (when the row itself acts) */
  button?: boolean
  dense?: boolean
}>(), { inset: 16 })

defineEmits<{ click: [e: MouseEvent] }>()

const tag = computed(() => props.to ? resolveComponent('NuxtLink') : props.button ? 'button' : 'div')
const interactive = computed(() => !!props.to || props.button)
</script>

<template>
  <component
    :is="tag"
    :to="to"
    :type="button ? 'button' : undefined"
    class="group/row relative flex w-full min-w-0 items-center gap-3 px-4 text-left outline-none after:pointer-events-none after:absolute after:right-0 after:bottom-0 after:left-(--sep) after:h-px after:bg-(--hairline) last:after:hidden focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
    :class="[
      dense ? 'min-h-12 py-2.5' : 'min-h-15 py-3',
      interactive && 'cursor-pointer transition-colors hover:bg-(--fill)/60 active:bg-(--fill)',
      selected && 'bg-primary/10 hover:bg-primary/12'
    ]"
    :style="{ '--sep': `${inset}px` }"
    :aria-current="selected ? 'page' : undefined"
    @click="$emit('click', $event)"
  >
    <slot name="leading" />
    <div class="min-w-0 flex-1">
      <slot>
        <div class="truncate text-headline text-highlighted">
          {{ title }}
        </div>
        <div v-if="subtitle" class="mt-0.5 truncate text-callout text-muted">
          {{ subtitle }}
        </div>
      </slot>
    </div>
    <slot name="trailing" />
    <UIcon v-if="chevron" name="i-lucide-chevron-right" class="size-5 shrink-0 text-dimmed" aria-hidden="true" />
  </component>
</template>
