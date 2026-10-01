<script setup lang="ts">
defineProps<{ title: string }>()

const router = useRouter()
const toast = useToast()
const searchOpen = useState<boolean>('search-open', () => false)

function nhapKho() {
  toast.add({ title: 'Mở form nhập kho (sắp có)', icon: 'i-lucide-package-plus', color: 'neutral' })
}
</script>

<template>
  <UDashboardNavbar :title="title">
    <template #leading>
      <UDashboardSidebarCollapse class="hidden lg:flex" />
      <div class="hidden items-center sm:flex">
        <UButton icon="i-lucide-chevron-left" color="neutral" variant="ghost" aria-label="Quay lại" @click="router.back()" />
        <UButton icon="i-lucide-chevron-right" color="neutral" variant="ghost" aria-label="Tiến tới" @click="router.forward()" />
      </div>
    </template>

    <template #right>
      <slot name="right" />
      <UButton icon="i-lucide-scan-barcode" color="neutral" variant="outline" aria-label="Quét mã" @click="searchOpen = true">
        <span class="hidden md:inline">Quét mã</span>
        <span class="hidden gap-0.5 lg:inline-flex"><UKbd value="meta" /><UKbd value="K" /></span>
      </UButton>
      <UButton icon="i-lucide-package-plus" color="neutral" variant="outline" aria-label="Nhập kho" @click="nhapKho">
        <span class="hidden md:inline">Nhập kho</span>
      </UButton>
    </template>
  </UDashboardNavbar>
</template>
