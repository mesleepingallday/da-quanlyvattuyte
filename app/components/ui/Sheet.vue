<script setup lang="ts">
/** Bottom sheet on phones and tablets, centered dialog on desktop: one component, both idioms. */
defineProps<{ title: string, description?: string }>()
const open = defineModel<boolean>('open', { default: false })
const desktop = useMediaQuery('(min-width: 1024px)')
</script>

<template>
  <UModal v-if="desktop" v-model:open="open" :title="title" :description="description">
    <template #body>
      <slot />
    </template>
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </UModal>
  <UDrawer v-else v-model:open="open" :title="title" :description="description" :handle="true">
    <template #body>
      <slot />
    </template>
    <template v-if="$slots.footer" #footer>
      <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <slot name="footer" />
      </div>
    </template>
  </UDrawer>
</template>
