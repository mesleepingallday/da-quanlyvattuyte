<script setup lang="ts">
const route = useRoute()
/** Focused task screens (compose, issue) hide the tab bar, like a pushed modal flow */
const task = computed(() => !!route.meta.task)
</script>

<template>
  <div class="min-h-dvh">
    <a href="#main" class="sr-only z-50 rounded-lg bg-default px-4 py-2 font-semibold focus:not-sr-only focus:fixed focus:top-3 focus:left-3">Bỏ qua, đến nội dung chính</a>
    <AppSidebar />
    <main id="main" class="min-h-dvh lg:ps-[264px]" :class="task ? 'pb-[env(safe-area-inset-bottom)]' : 'pb-[calc(env(safe-area-inset-bottom)+92px)] lg:pb-0'">
      <slot />
    </main>
    <AppTabBar v-if="!task" />
    <AppSearch />
    <AppScan />
    <SlipReasonSheet />
  </div>
</template>
