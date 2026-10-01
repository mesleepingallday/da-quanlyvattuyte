<script setup lang="ts">
defineProps<{ name: string }>()
</script>

<template>
  <AppTodayIcon v-if="name === 'today'" />
  <UIcon v-else :name="name" aria-hidden="true" />
</template>
