<script setup lang="ts">
/** Empty state: says what is (not) here and offers the next action. */
defineProps<{ icon: string, title: string, description?: string, compact?: boolean }>()
</script>

<template>
  <div class="flex flex-col items-center text-center" :class="compact ? 'px-6 py-8' : 'px-6 py-16'">
    <div class="mb-4 flex size-16 items-center justify-center rounded-full bg-(--fill)">
      <UIcon :name="icon" class="size-8 text-muted" aria-hidden="true" />
    </div>
    <p class="text-headline text-highlighted">
      {{ title }}
    </p>
    <p v-if="description" class="mt-1 max-w-sm text-callout text-muted">
      {{ description }}
    </p>
    <div v-if="$slots.default" class="mt-5 flex flex-wrap justify-center gap-2">
      <slot />
    </div>
  </div>
</template>
