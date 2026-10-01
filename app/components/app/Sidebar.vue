<script setup lang="ts">
const { items, isActive, primary, searchOpen } = useNav()
const { role } = useSession()
</script>

<template>
  <aside class="fixed inset-y-0 left-0 z-40 hidden w-[264px] flex-col border-r border-(--hairline) bg-(--page) lg:flex" aria-label="Thanh bên">
    <div class="flex items-center gap-3 px-5 pt-6 pb-5">
      <img src="/icon.svg" alt="" class="size-9 rounded-[9px] shadow-raise">
      <div class="min-w-0 leading-tight">
        <p class="text-headline text-highlighted">
          Kho VTYT
        </p>
        <p class="text-footnote text-muted">
          BV quận Phú Nhuận
        </p>
      </div>
    </div>

    <div class="px-3">
      <button
        type="button"
        class="flex h-10 w-full items-center gap-2.5 rounded-xl bg-(--fill) px-3 text-[15px] text-dimmed transition-colors hover:bg-(--fill-strong)"
        @click="searchOpen = true"
      >
        <UIcon name="i-lucide-search" class="size-[18px]" aria-hidden="true" />
        <span class="flex-1 text-left">Tìm kiếm</span>
        <span class="flex gap-0.5"><UKbd value="meta" size="sm" /><UKbd value="K" size="sm" /></span>
      </button>
    </div>

    <nav class="mt-5 flex-1 space-y-0.5 overflow-y-auto px-3" aria-label="Điều hướng chính">
      <NuxtLink
        v-for="item in items"
        :key="item.key"
        :to="item.to"
        class="flex h-10 items-center gap-3 rounded-xl px-3 text-[15px] font-medium transition-colors"
        :class="isActive(item.to) ? 'bg-default text-highlighted shadow-raise' : 'text-toned hover:bg-(--fill)'"
        :aria-current="isActive(item.to) ? 'page' : undefined"
      >
        <AppNavIcon :name="item.icon" class="size-5 shrink-0" :class="isActive(item.to) ? 'text-primary' : 'text-muted'" />
        <span class="flex-1">{{ item.label }}</span>
        <span
          v-if="item.badge"
          class="min-w-6 rounded-full px-1.5 text-center text-footnote font-semibold tabular"
          :class="isActive(item.to) ? 'bg-primary/12 text-primary' : 'bg-(--fill) text-toned'"
        >{{ item.badge }}<span class="sr-only"> việc cần xử lý</span></span>
      </NuxtLink>
    </nav>

    <div class="space-y-2 p-3">
      <UButton
        v-if="role === 'dd' || role === 'kho'"
        :label="primary.label"
        :icon="primary.icon"
        block
        size="lg"
        @click="primary.run()"
      />
      <div class="border-t border-(--hairline) pt-2">
        <AppUserMenu />
      </div>
    </div>
  </aside>
</template>
