<script setup lang="ts">
useHead({ title: 'Tổng quan' })

const toast = useToast()
const filter = ref<'all' | 'W' | 'A' | 'D' | 'R' | 'N'>('all')
const filterItems = [
  { label: 'Tất cả trạng thái', value: 'all' },
  { label: 'Chờ duyệt', value: 'W' },
  { label: 'Đã duyệt', value: 'A' },
  { label: 'Đã cấp phát', value: 'D' },
  { label: 'Từ chối', value: 'R' },
  { label: 'Nháp', value: 'N' }
]
const drawerOpen = ref(false)
const current = ref<number | null>(null)

function open(n: number) {
  current.value = n
  drawerOpen.value = true
}
</script>

<template>
  <UDashboardPanel id="tong-quan">
    <template #header>
      <ShellAppNavbar title="Tổng quan">
        <template #right>
          <USelect v-model="filter" :items="filterItems" icon="i-lucide-filter" class="w-36 sm:w-44" aria-label="Lọc trạng thái" />
          <UButton
            icon="i-lucide-file-spreadsheet"
            label="Xuất Excel"
            color="neutral"
            variant="ghost"
            class="hidden sm:inline-flex"
            @click="toast.add({ title: 'Đã xuất Excel', icon: 'i-lucide-check', color: 'success' })"
          />
        </template>
      </ShellAppNavbar>
    </template>

    <template #body>
      <div class="space-y-8">
        <LotsAttentionCards />

        <section>
          <div class="mb-3">
            <h2 class="text-base font-semibold text-highlighted">
              Phiếu lĩnh
            </h2>
            <p class="text-sm text-muted">
              Nhóm theo khoa lĩnh
            </p>
          </div>
          <SlipsTable v-model:filter="filter" @open="open" />
        </section>

        <SlipsDrawer v-model:open="drawerOpen" :slip-id="current" />
      </div>
    </template>
  </UDashboardPanel>
</template>
