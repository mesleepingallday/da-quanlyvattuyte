<script setup lang="ts">
/** Reason for rejecting a slip or sending it back. Required, because the requester has to act on it. */
const { reason, submitReason } = useSlipActions()
const text = ref('')

const QUICK = {
  reject: ['Vượt định mức tháng của khoa', 'Kho không đủ hàng, đề nghị giảm số lượng', 'Thiếu y lệnh cho hóa chất', 'Trùng với phiếu đã lĩnh trong tuần'],
  return: ['Kho không đủ số lượng, đề nghị khoa giảm', 'Sai vật tư hoặc đơn vị tính', 'Thiếu ghi chú lý do lĩnh']
}

const open = computed({
  get: () => reason.value.open,
  set: (v: boolean) => { reason.value = { ...reason.value, open: v } }
})
watch(open, (v) => { if (v) text.value = '' })

const isReject = computed(() => reason.value.mode === 'reject')
</script>

<template>
  <UiSheet
    v-model:open="open"
    :title="isReject ? `Từ chối ${reason.so}` : `Trả lại ${reason.so} cho khoa`"
    :description="isReject ? 'Phiếu sẽ dừng lại. Người lập phiếu sẽ đọc lý do này để sửa và gửi lại.' : 'Phiếu quay về khoa ở trạng thái nháp để sửa.'"
  >
    <div class="space-y-3">
      <UTextarea v-model="text" :rows="3" autoresize autofocus class="w-full" placeholder="Lý do" :aria-label="isReject ? 'Lý do từ chối' : 'Lý do trả lại'" />
      <div class="flex flex-wrap gap-2">
        <UButton
          v-for="q in QUICK[reason.mode]"
          :key="q"
          :label="q"
          color="neutral"
          variant="soft"
          size="sm"
          @click="text = q"
        />
      </div>
    </div>
    <template #footer>
      <UButton label="Hủy" color="neutral" variant="soft" size="lg" class="justify-center" @click="open = false" />
      <UButton
        :label="isReject ? 'Từ chối phiếu' : 'Trả lại khoa'"
        :color="isReject ? 'error' : 'primary'"
        size="lg"
        class="justify-center"
        :disabled="!text.trim()"
        @click="submitReason(text)"
      />
    </template>
  </UiSheet>
</template>
