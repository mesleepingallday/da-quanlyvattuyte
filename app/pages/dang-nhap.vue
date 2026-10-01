<script setup lang="ts">
import { DEMO_PEOPLE } from '~/data/people'

definePageMeta({ layout: 'auth' })
useHead({ title: 'Đăng nhập' })

const { signIn, onboarded } = useSession()

const code = ref('')
const password = ref('')
const remember = ref(true)
const reveal = ref(false)
const error = ref('')

function go(key: string) {
  signIn(key)
  navigateTo(onboarded.value ? '/' : '/chao-mung')
}

function submit() {
  const p = DEMO_PEOPLE.find(x => x.code.toLowerCase() === code.value.trim().toLowerCase())
  if (!code.value.trim() || !password.value) {
    error.value = 'Nhập mã nhân viên và mật khẩu để đăng nhập.'
    return
  }
  if (!p || password.value !== '123456') {
    error.value = 'Mã nhân viên hoặc mật khẩu chưa đúng. Kiểm tra lại, hoặc gọi P.VTTBYT (máy lẻ 214) để cấp lại mật khẩu.'
    return
  }
  error.value = ''
  go(p.key)
}
</script>

<template>
  <div class="w-full max-w-[400px]">
    <div class="flex flex-col items-center text-center">
      <img src="/icon.svg" alt="" class="size-[76px] rounded-[18px] shadow-float">
      <h1 class="mt-5 text-title-2 text-highlighted">
        Kho Vật tư y tế
      </h1>
      <p class="mt-1 text-[15px] text-muted">
        Bệnh viện quận Phú Nhuận
      </p>
    </div>

    <form class="mt-9" novalidate @submit.prevent="submit">
      <div class="overflow-hidden rounded-group bg-default">
        <label class="flex h-14 items-center gap-3 border-b border-(--hairline) px-4 focus-within:ring-2 focus-within:ring-primary focus-within:ring-inset">
          <span class="w-28 shrink-0 text-[15px] font-medium text-highlighted">Mã nhân viên</span>
          <input
            v-model="code"
            name="username"
            autocomplete="username"
            autocapitalize="characters"
            spellcheck="false"
            placeholder="Ví dụ NV0412"
            class="min-w-0 flex-1 bg-transparent text-base text-highlighted outline-none placeholder:text-dimmed"
            :aria-invalid="!!error"
            aria-describedby="login-error"
          >
        </label>
        <label class="flex h-14 items-center gap-3 px-4 focus-within:ring-2 focus-within:ring-primary focus-within:ring-inset">
          <span class="w-28 shrink-0 text-[15px] font-medium text-highlighted">Mật khẩu</span>
          <input
            v-model="password"
            name="password"
            :type="reveal ? 'text' : 'password'"
            autocomplete="current-password"
            placeholder="Bắt buộc"
            class="min-w-0 flex-1 bg-transparent text-base text-highlighted outline-none placeholder:text-dimmed"
            :aria-invalid="!!error"
            aria-describedby="login-error"
          >
          <UButton
            :icon="reveal ? 'i-lucide-eye-off' : 'i-lucide-eye'"
            color="neutral"
            variant="ghost"
            size="sm"
            square
            class="-me-2 text-muted"
            :aria-label="reveal ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
            @click="reveal = !reveal"
          />
        </label>
      </div>

      <p v-if="error" id="login-error" role="alert" class="mt-3 flex gap-2 px-1 text-footnote text-error">
        <UIcon name="i-lucide-circle-alert" class="mt-px size-4 shrink-0" aria-hidden="true" />
        {{ error }}
      </p>

      <USwitch v-model="remember" label="Ghi nhớ trên máy này" class="mt-4 px-1" :ui="{ label: 'text-[15px] text-default font-normal' }" />

      <UButton type="submit" label="Đăng nhập" block size="xl" class="mt-6" />
    </form>

    <section class="mt-11" aria-labelledby="demo-title">
      <h2 id="demo-title" class="px-1 text-headline text-highlighted">
        Dùng thử với tài khoản mẫu
      </h2>
      <p class="mt-0.5 px-1 text-footnote text-muted">
        Chọn một người để vào ngay. Mật khẩu của mọi tài khoản mẫu là 123456.
      </p>
      <div class="mt-3 overflow-hidden rounded-group bg-default">
        <UiRow v-for="p in DEMO_PEOPLE" :key="p.key" button chevron :inset="64" @click="go(p.key)">
          <template #leading>
            <UiAvatar :who="p" :size="36" />
          </template>
          <div class="truncate text-headline text-highlighted">
            {{ p.name }}
          </div>
          <div class="truncate text-callout text-muted">
            {{ p.title }}{{ p.role === 'dd' && p.dept ? `, ${p.dept}` : '' }}
          </div>
        </UiRow>
      </div>
    </section>

    <p class="mt-10 text-center text-footnote text-muted">
      Bản thử nghiệm 3.0, dùng dữ liệu mẫu.
    </p>
  </div>
</template>
