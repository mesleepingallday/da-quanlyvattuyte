<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

/** Account menu: who is signed in, appearance, settings, sign out */
defineProps<{ compact?: boolean }>()
const { user, signOut } = useSession()
const colorMode = useColorMode()

const modes = [
  { label: 'Sáng', value: 'light', icon: 'i-lucide-sun' },
  { label: 'Tối', value: 'dark', icon: 'i-lucide-moon' },
  { label: 'Theo hệ thống', value: 'system', icon: 'i-lucide-monitor' }
]

const items = computed<DropdownMenuItem[][]>(() => [
  [{ label: user.value?.name ?? '', description: user.value?.title, type: 'label' }],
  [
    { label: 'Tài khoản và cài đặt', icon: 'i-lucide-settings', to: '/tai-khoan' },
    {
      label: 'Giao diện',
      icon: colorMode.value === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun',
      children: modes.map(m => ({
        label: m.label,
        icon: m.icon,
        type: 'checkbox' as const,
        checked: colorMode.preference === m.value,
        onUpdateChecked: () => { colorMode.preference = m.value }
      }))
    }
  ],
  [{ label: 'Đăng xuất', icon: 'i-lucide-log-out', onSelect: () => { signOut(); navigateTo('/dang-nhap') } }]
])
</script>

<template>
  <UDropdownMenu v-if="user" :items="items" :content="{ side: 'top', align: 'start' }">
    <button
      type="button"
      class="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-(--fill) data-[state=open]:bg-(--fill)"
      :aria-label="`Tài khoản: ${user.name}`"
    >
      <UiAvatar :who="user" :size="36" />
      <span v-if="!compact" class="min-w-0 flex-1">
        <span class="block truncate text-[15px]/5 font-semibold text-highlighted">{{ user.name }}</span>
        <span class="block truncate text-footnote text-muted">{{ user.title }}</span>
      </span>
      <UIcon v-if="!compact" name="i-lucide-chevrons-up-down" class="size-4 shrink-0 text-dimmed" aria-hidden="true" />
    </button>
  </UDropdownMenu>
</template>
