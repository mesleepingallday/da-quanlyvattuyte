<script setup lang="ts">
import { vi } from '@nuxt/ui/locale'
</script>

<template>
  <UApp :locale="vi" :toaster="{ position: 'top-center', duration: 5000, max: 3 }" :tooltip="{ delayDuration: 400 }">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
