<script setup lang="ts">
useHead({ title: 'Không tìm thấy trang' })
const route = useRoute()
</script>

<template>
  <div class="flex min-h-[70dvh] items-center justify-center px-4">
    <UiEmpty icon="i-lucide-map-pin-off" heading="h1" title="Không tìm thấy trang này" :description="`Đường dẫn ${route.path} không có trong ứng dụng. Có thể phiếu đã bị xóa hoặc bạn gõ nhầm.`">
      <UButton label="Về Hôm nay" to="/" />
    </UiEmpty>
  </div>
</template>
