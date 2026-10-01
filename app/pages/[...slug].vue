<script setup lang="ts">
const route = useRoute()
const names: Record<string, string> = {
  'phieu-linh': 'Phiếu lĩnh',
  'cap-phat': 'Cấp phát',
  'nhap-kho': 'Nhập kho',
  'danh-muc': 'Danh mục vật tư',
  'du-tru': 'Dự trù tháng',
  'bao-cao': 'Báo cáo X-N-T',
  'nhat-ky': 'Nhật ký'
}
const slug = computed(() => [route.params.slug].flat().filter(Boolean)[0] ?? '')
const known = computed(() => names[slug.value])
useHead({ title: () => known.value ?? 'Sắp có' })
</script>

<template>
  <UDashboardPanel id="sap-co">
    <template #header>
      <ShellAppNavbar :title="known ?? 'Sắp có'" />
    </template>
    <template #body>
      <div class="flex min-h-[60vh] flex-1 items-center justify-center">
    <UEmpty
      :title="known ? `${known} — sắp có` : 'Không tìm thấy trang'"
      description="Màn hình này đang được xây dựng. Hiện có Tổng quan và Tồn kho theo lô."
      :actions="[{ label: 'Về Tổng quan', to: '/', color: 'neutral', variant: 'outline' }]"
    >
      <template #leading>
        <LotLabel :seed="slug || 'sap-co'" class="mx-auto mb-4" />
      </template>
    </UEmpty>
      </div>
    </template>
  </UDashboardPanel>
</template>
