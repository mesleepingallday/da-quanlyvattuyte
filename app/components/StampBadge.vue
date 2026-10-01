<script setup lang="ts">
withDefaults(defineProps<{ label: string, color?: 'error' | 'success' | 'warning' }>(), { color: 'error' })
</script>

<template>
  <span
    class="inline-block -rotate-6 rounded-sm border-2 px-2 py-0.5 font-mono text-xs font-semibold uppercase tracking-widest"
    :class="{
      'border-error text-error': color === 'error',
      'border-success text-success': color === 'success',
      'border-warning text-warning': color === 'warning'
    }"
  >{{ label }}</span>
</template>
