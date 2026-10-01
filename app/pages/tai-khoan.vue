<script setup lang="ts">
import { DEMO_PEOPLE } from '~/data/people'

useHead({ title: 'Tài khoản' })

const { user, signIn, signOut, replayOnboarding } = useSession()
const { reset } = useStore()
const colorMode = useColorMode()
const toast = useToast()

const appearance = computed({
  get: () => colorMode.preference as 'light' | 'dark' | 'system',
  set: (v) => { colorMode.preference = v }
})
const modes = [
  { label: 'Sáng', value: 'light' as const },
  { label: 'Tối', value: 'dark' as const },
  { label: 'Tự động', value: 'system' as const }
]

const resetOpen = ref(false)
function doReset() {
  reset()
  resetOpen.value = false
  toast.add({ title: 'Đã đặt lại dữ liệu mẫu', description: 'Phiếu, lô và phiếu nhập trở về như ngày 30/09/2026.', icon: 'i-lucide-rotate-ccw', color: 'neutral' })
}
function switchTo(key: string) {
  signIn(key)
  navigateTo('/')
}
function replay() {
  replayOnboarding()
  navigateTo('/chao-mung')
}
function logout() {
  signOut()
  navigateTo('/dang-nhap')
}
</script>

<template>
  <div v-if="user">
    <AppPageHeader title="Tài khoản" width="720px" />
    <div class="mx-auto max-w-[720px] space-y-8 px-4 pb-16 lg:px-8">
      <section class="flex items-center gap-4 rounded-group bg-default p-5">
        <UiAvatar :who="user" :size="64" />
        <div class="min-w-0">
          <p class="text-title-3 text-highlighted">
            {{ user.name }}
          </p>
          <p class="text-callout text-muted">
            {{ user.title }}{{ user.dept && user.role === 'dd' ? `, ${user.dept}` : '' }}
          </p>
          <p class="mt-0.5 text-footnote text-muted tabular">
            Mã nhân viên {{ user.code }}
          </p>
        </div>
      </section>

      <UiGroup title="Giao diện" footer="Tự động theo cài đặt sáng tối của máy.">
        <div class="p-3">
          <UiSegmented v-model="appearance" :options="modes" label="Giao diện" />
        </div>
      </UiGroup>

      <UiGroup title="Bản dùng thử" footer="Dữ liệu mẫu lưu trên trình duyệt này. Đặt lại để bắt đầu buổi trình diễn mới.">
        <UiRow v-for="p in DEMO_PEOPLE.filter(x => x.key !== user!.key)" :key="p.key" button chevron :inset="64" @click="switchTo(p.key)">
          <template #leading>
            <UiAvatar :who="p" :size="36" />
          </template>
          <div class="truncate text-headline text-highlighted">
            Chuyển sang {{ p.name }}
          </div>
          <div class="truncate text-callout text-muted">
            {{ p.title }}{{ p.role === 'dd' && p.dept ? `, ${p.dept}` : '' }}
          </div>
        </UiRow>
        <UiRow button :inset="64" @click="replay">
          <template #leading>
            <div class="flex size-9 items-center justify-center rounded-full bg-primary/12">
              <UIcon name="i-lucide-sparkles" class="size-5 text-primary" aria-hidden="true" />
            </div>
          </template>
          <span class="text-headline text-highlighted">Xem lại phần giới thiệu</span>
        </UiRow>
        <UiRow button :inset="64" @click="resetOpen = true">
          <template #leading>
            <div class="flex size-9 items-center justify-center rounded-full bg-(--fill)">
              <UIcon name="i-lucide-rotate-ccw" class="size-5 text-toned" aria-hidden="true" />
            </div>
          </template>
          <span class="text-headline text-highlighted">Đặt lại dữ liệu mẫu</span>
        </UiRow>
      </UiGroup>

      <UiGroup title="Hỗ trợ">
        <UiRow :inset="64">
          <template #leading>
            <div class="flex size-9 items-center justify-center rounded-full bg-(--fill)">
              <UIcon name="i-lucide-phone" class="size-5 text-toned" aria-hidden="true" />
            </div>
          </template>
          <div class="text-headline text-highlighted">
            P.VTTBYT, máy lẻ 214
          </div>
          <div class="text-callout text-muted">
            Cấp lại mật khẩu, đổi khoa, thêm vật tư vào danh mục
          </div>
        </UiRow>
        <UiRow :inset="64">
          <template #leading>
            <div class="flex size-9 items-center justify-center rounded-full bg-(--fill)">
              <UIcon name="i-lucide-book-open" class="size-5 text-toned" aria-hidden="true" />
            </div>
          </template>
          <div class="text-headline text-highlighted">
            Quy trình QĐ 651/QĐ-BVPN
          </div>
          <div class="text-callout text-muted">
            Nhập hàng, bảo quản và cấp phát vật tư y tế, ban hành 05/12/2024
          </div>
        </UiRow>
      </UiGroup>

      <div class="overflow-hidden rounded-group bg-default">
        <UiRow button @click="logout">
          <span class="text-headline text-error">Đăng xuất</span>
        </UiRow>
      </div>

      <p class="text-center text-footnote text-dimmed">
        Kho VTYT 3.0, Bệnh viện quận Phú Nhuận
      </p>
    </div>

    <UiSheet v-model:open="resetOpen" title="Đặt lại dữ liệu mẫu?" description="Mọi thay đổi trong buổi dùng thử (phiếu đã duyệt, cấp phát, nhập kho) sẽ mất.">
      <template #footer>
        <UButton label="Hủy" color="neutral" variant="soft" size="lg" class="justify-center" @click="resetOpen = false" />
        <UButton label="Đặt lại" color="error" size="lg" class="justify-center" @click="doReset" />
      </template>
    </UiSheet>
  </div>
</template>
