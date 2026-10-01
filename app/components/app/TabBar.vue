<script setup lang="ts">
/** Floating glass tab bar for phones and tablets, with the role's main action beside it */
const { items, isActive, primary } = useNav()
</script>

<template>
  <nav
    class="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pt-2 pb-[max(10px,env(safe-area-inset-bottom))] lg:hidden"
    aria-label="Điều hướng chính"
  >
    <div class="mx-auto flex max-w-xl items-end gap-2.5">
      <div class="glass glass-edge pointer-events-auto flex flex-1 items-stretch rounded-full p-1 shadow-float">
        <NuxtLink
          v-for="item in items"
          :key="item.key"
          :to="item.to"
          class="relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-full px-1 pt-1.5 pb-1 text-[10.5px]/[13px] font-semibold transition-colors"
          :class="isActive(item.to) ? 'bg-(--fill) text-primary' : 'text-toned'"
          :aria-current="isActive(item.to) ? 'page' : undefined"
        >
          <AppNavIcon :name="item.icon" class="size-6" />
          <span class="truncate">{{ item.label }}</span>
          <span
            v-if="item.badge"
            class="absolute top-0.5 left-1/2 ms-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-(--mark-red) px-1 text-[11px] font-semibold text-white tabular"
          >{{ item.badge }}<span class="sr-only"> việc cần xử lý</span></span>
        </NuxtLink>
      </div>
      <button
        type="button"
        class="glass glass-edge pointer-events-auto flex size-[60px] shrink-0 items-center justify-center rounded-full text-primary shadow-float transition-transform active:scale-95"
        :aria-label="primary.label"
        @click="primary.run()"
      >
        <UIcon :name="primary.icon" class="size-7" aria-hidden="true" />
      </button>
    </div>
  </nav>
</template>
