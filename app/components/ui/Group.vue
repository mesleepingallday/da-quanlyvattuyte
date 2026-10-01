<script setup lang="ts">
/** Inset grouped list (iOS Settings style): a titled section with rows on a rounded surface. */
defineProps<{
  title?: string
  count?: number
  footer?: string
  action?: { label: string, to: string }
  /** Drop the surface, for groups that hold their own cards */
  bare?: boolean
}>()
</script>

<template>
  <section class="min-w-0">
    <header v-if="title || $slots.header || action" class="mb-2 flex items-end justify-between gap-3 px-1">
      <slot name="header">
        <h2 class="text-title-3 text-highlighted">
          {{ title }}<span v-if="count !== undefined" class="ms-1.5 font-medium text-muted tabular">{{ count }}</span>
        </h2>
      </slot>
      <slot name="action">
        <NuxtLink v-if="action" :to="action.to" class="shrink-0 rounded-md text-[15px]/6 font-medium text-primary hover:opacity-80">
          {{ action.label }}
        </NuxtLink>
      </slot>
    </header>
    <div :class="bare ? '' : 'overflow-hidden rounded-group bg-default'">
      <slot />
    </div>
    <p v-if="footer || $slots.footer" class="mt-2 px-4 text-footnote text-muted">
      <slot name="footer">
        {{ footer }}
      </slot>
    </p>
  </section>
</template>
