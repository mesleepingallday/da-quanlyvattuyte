<script setup lang="ts">
import type { NavigationMenuItem, DropdownMenuItem, CommandPaletteGroup } from '@nuxt/ui'

const toast = useToast()
const { pendingCount } = useSlips()
const { role, roles } = useRole()


const open = ref(false)
const searchOpen = useState<boolean>('search-open', () => false)
const close = () => { open.value = false }

const nav = computed<NavigationMenuItem[]>(() => [
  { label: 'Công việc', type: 'label' },
  { label: 'Tổng quan', icon: 'i-lucide-layout-grid', to: '/', onSelect: close },
  { label: 'Phiếu lĩnh', icon: 'i-lucide-file-text', to: '/phieu-linh', badge: pendingCount.value || undefined, onSelect: close },
  { label: 'Cấp phát', icon: 'i-lucide-package-open', to: '/cap-phat', onSelect: close },
  { label: 'Nhập kho', icon: 'i-lucide-package-plus', to: '/nhap-kho', onSelect: close },
  { label: 'Kho', type: 'label' },
  { label: 'Tồn kho theo lô', icon: 'i-lucide-warehouse', to: '/ton-kho', onSelect: close },
  { label: 'Danh mục vật tư', icon: 'i-lucide-list', to: '/danh-muc', onSelect: close },
  { label: 'Dự trù tháng', icon: 'i-lucide-calendar-days', to: '/du-tru', onSelect: close },
  { label: 'Báo cáo', type: 'label' },
  { label: 'Báo cáo X-N-T', icon: 'i-lucide-chart-column', to: '/bao-cao', onSelect: close },
  { label: 'Nhật ký', icon: 'i-lucide-clock', to: '/nhat-ky', onSelect: close }
])

const searchGroups = computed<CommandPaletteGroup[]>(() => [{
  id: 'pages',
  label: 'Trang',
  items: nav.value.filter(i => i.to).map(i => ({
    label: i.label as string,
    icon: i.icon,
    to: i.to as string
  }))
}])

const roleItems = computed<DropdownMenuItem[]>(() => roles.map(r => ({
  label: r,
  type: 'checkbox' as const,
  checked: role.value === r,
  onUpdateChecked(checked: boolean) {
    if (!checked || role.value === r) return
    role.value = r
    toast.add({ title: `Đã chuyển vai trò: ${r}`, icon: 'i-lucide-user-check', color: 'success' })
  }
})))

function say(msg: string, icon: string) {
  toast.add({ title: msg, icon, color: 'neutral' })
}
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      v-model:open="open"
      :resizable="false"
      collapsible
      :ui="{ footer: 'flex-col items-stretch gap-3' }"
    >
      <template #header="{ collapsed }">
        <div class="flex items-center gap-2.5 px-1.5 py-0.5" :class="collapsed && 'mx-auto px-0'">
          <svg class="size-8 shrink-0" viewBox="0 0 32 32" aria-hidden="true">
            <rect width="32" height="32" rx="9" fill="#F2A900" />
            <g fill="#0B0D0F">
              <rect x="7" y="9" width="2" height="14" />
              <rect x="11" y="9" width="1" height="14" />
              <rect x="14" y="9" width="3" height="14" />
              <rect x="19" y="9" width="1" height="14" />
              <rect x="22" y="9" width="3" height="14" />
            </g>
          </svg>
          <div v-if="!collapsed" class="min-w-0 leading-tight">
            <b class="block text-[15px] font-bold tracking-tight">Kho VTYT</b>
            <span class="text-xs text-muted">BV quận Phú Nhuận</span>
          </div>
        </div>
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton :collapsed="collapsed" label="Tìm kiếm nhanh" class="w-full" />

        <UNavigationMenu :collapsed="collapsed" :items="nav" orientation="vertical" />
      </template>

      <template #footer="{ collapsed }">
        <div v-if="!collapsed" class="px-1.5">
          <p class="mb-2 text-[13px] text-muted">
            Đã cấp <b class="font-mono font-semibold text-highlighted">68%</b> ngân sách tháng 9
          </p>
          <UProgress :model-value="68" size="sm" aria-label="Ngân sách tháng 9 đã cấp" />
          <p class="mt-2 font-mono text-xs tracking-tight text-dimmed">
            1.360.000.000 / 2.000.000.000 ₫
          </p>
        </div>
        <UButton
          icon="i-lucide-plus"
          :label="collapsed ? undefined : 'Lập dự trù tháng 10'"
          :aria-label="collapsed ? 'Lập dự trù tháng 10' : undefined"
          color="neutral"
          variant="outline"
          block
          @click="say('Mở form lập dự trù tháng 10 (sắp có)', 'i-lucide-calendar-plus')"
        />
        <UDropdownMenu :items="roleItems" :content="{ side: 'top', align: 'start' }" :ui="{ content: 'min-w-52' }">
          <UButton color="neutral" variant="ghost" block :class="collapsed ? 'justify-center' : 'justify-start'" :trailing-icon="collapsed ? undefined : 'i-lucide-chevrons-up-down'" :aria-label="collapsed ? `Trần Văn Hùng · ${role}` : undefined" :ui="{ trailingIcon: 'ms-auto' }">
            <UAvatar v-if="collapsed" text="TH" alt="Trần Văn Hùng" size="md" />
            <UUser v-else name="Trần Văn Hùng" :description="role" :avatar="{ text: 'TH', alt: 'Trần Văn Hùng' }" size="md" />
          </UButton>
        </UDropdownMenu>
      </template>
    </UDashboardSidebar>

    <!-- title/description: v4.11 locales have no dashboardSearch.title/description keys, the raw key would be announced -->
    <UDashboardSearch
      v-model:open="searchOpen"
      :groups="searchGroups"
      :color-mode="false"
      title="Tìm kiếm nhanh"
      description="Tìm trang, phiếu, lô"
      placeholder="Tìm trang, phiếu, lô..."
    />

    <slot />
  </UDashboardGroup>
</template>
