<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

/**
 * Large title that hands over to a compact glass toolbar once it scrolls away (iOS/macOS idiom).
 * Actions live in the toolbar so they stay reachable while reading.
 */
withDefaults(defineProps<{
  title: string
  subtitle?: string
  back?: RouteLocationRaw
  backLabel?: string
  /** Max width of the content column, to align the header with the page body */
  width?: string
  /** Keep the toolbar background visible from the start (detail panes) */
  solid?: boolean
  /** In split views the list is already visible on desktop, so the back button is for phones only */
  backMobileOnly?: boolean
}>(), { width: '100%' })

const sentinel = ref<HTMLElement | null>(null)
const scrolled = ref(false)
useIntersectionObserver(sentinel, ([entry]) => { scrolled.value = !(entry?.isIntersecting ?? true) }, { rootMargin: '-56px 0px 0px 0px' })
</script>

<template>
  <div>
    <div
      class="sticky top-0 z-30 border-b pt-[env(safe-area-inset-top)] transition-[background-color,border-color] duration-200"
      :class="scrolled || solid ? 'glass border-(--hairline)' : 'border-transparent'"
    >
      <div class="relative mx-auto flex h-13 items-center gap-2 px-4 lg:px-8" :style="{ maxWidth: width }">
        <div class="flex min-w-0 flex-1 items-center">
          <UButton
            v-if="back"
            :to="back"
            icon="i-lucide-chevron-left"
            :label="backLabel"
            color="primary"
            variant="link"
            class="-ms-2 px-1 text-[16px] font-medium"
            :class="backMobileOnly && 'lg:hidden'"
            :aria-label="backLabel ? undefined : 'Quay lại'"
          />
          <slot name="leading" />
        </div>
        <p
          class="pointer-events-none absolute left-1/2 max-w-[calc(100%-13rem)] -translate-x-1/2 truncate text-headline text-highlighted transition-opacity duration-200 sm:max-w-[50%]"
          :class="scrolled ? 'opacity-100' : 'opacity-0'"
          aria-hidden="true"
        >
          {{ title }}
        </p>
        <div class="flex shrink-0 items-center gap-1.5">
          <slot name="actions" />
        </div>
      </div>
    </div>
    <div class="mx-auto px-4 pt-1 pb-5 lg:px-8 lg:pt-2" :style="{ maxWidth: width }">
      <div ref="sentinel" class="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <div class="min-w-0">
          <h1 class="text-title-2 text-highlighted lg:text-title">
            {{ title }}
          </h1>
          <p v-if="subtitle || $slots.subtitle" class="mt-1 text-[15px]/5 text-muted">
            <slot name="subtitle">
              {{ subtitle }}
            </slot>
          </p>
        </div>
        <slot name="aside" />
      </div>
      <slot name="below" />
    </div>
  </div>
</template>
