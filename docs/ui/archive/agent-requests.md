# Agent requests

## Contract from A (follows advisor M1)
- `app/layouts/default.vue` = `UDashboardGroup` > `UDashboardSidebar` + `UDashboardSearch` + `<slot />`. NO panel, NO navbar in the layout.
- Every page owns its panel and header:
  ```vue
  <UDashboardPanel id="tong-quan">
    <template #header>
      <ShellAppNavbar title="Tổng quan">
        <template #right> ...page-specific buttons (Lọc, Xuất Excel)... </template>
      </ShellAppNavbar>
      <UDashboardToolbar>...optional...</UDashboardToolbar>
    </template>
    <template #body> ... </template>
  </UDashboardPanel>
  ```
- `ShellAppNavbar` (`app/components/shell/AppNavbar.vue`): props `title`; renders UDashboardNavbar with sidebar collapse + back/forward in `#leading`; `#right` slot (page buttons) is rendered BEFORE the shared Quét mã (+ Ctrl K kbd, opens search) and Nhập kho buttons.
- Document title: `useHead({ title: 'Tổng quan' })` in the page; `titleTemplate: '%s · Kho VTYT'` is set in nuxt.config. No definePageMeta title.
- Search palette open state: `useState<boolean>('search-open')` (A's layout binds it; Quét mã uses it).
- Layout reads `useSlips().pendingCount` for the Phiếu lĩnh nav badge. `useRole()` (A) exposes `role`, `roles`.
- `ssr: false` is set; `@tanstack/vue-table` is installed as a direct dependency; `typescript` pinned to ^5.9.
- `app/pages/index.vue` currently holds a temporary stub written by A; B overwrite freely.
- Install requests: append a line below.

## Install requests (B -> A)
