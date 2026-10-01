# Advisor notes: Nuxt UI v4 migration (pass 1)

Checked against ui.nuxt.com raw docs (v4, installed: @nuxt/ui 4.11.2, nuxt 4.5.2). Executors: read MUST first.

## MUST change

### M1. Page owns `UDashboardPanel` + `UDashboardNavbar` (overrides plan Agent B step 4)
The plan says the layout owns the navbar and pages render body only. **Don't.** In v4 `UDashboardNavbar` is designed
to sit in the `#header` slot of a `UDashboardPanel`, and the panel is per page (official dashboard template does this).
Page-specific header content (Tổng quan: Lọc + Xuất Excel + `UDashboardToolbar`; Tồn kho: search) has no clean
route out of a page into a layout-owned header (would need slots-through-NuxtPage or Teleport hacks).
- **Agent A**: `layouts/default.vue` = `UDashboardGroup` › `UDashboardSidebar` + `UDashboardSearch` + `<slot />`. No panel, no navbar.
  Also build `app/components/shell/AppNavbar.vue`: wraps `UDashboardNavbar` with `title` prop, `#leading` =
  `UDashboardSidebarCollapse`, shared right actions (Quét mã + `UKbd`, Nhập kho), and a `<slot name="right" />`
  rendered BEFORE the shared actions for page-specific buttons.
- **Agent B**: every page:
```vue
<template>
  <UDashboardPanel id="tong-quan">
    <template #header>
      <ShellAppNavbar title="Tổng quan"><template #right>…Lọc, Xuất Excel…</template></ShellAppNavbar>
      <UDashboardToolbar>…search / tabs…</UDashboardToolbar>   <!-- optional -->
    </template>
    <template #body>…cards, UTable…</template>
  </UDashboardPanel>
</template>
```
  Component name: files in `components/shell/AppNavbar.vue` auto-import as `<ShellAppNavbar>` (path prefix), not `<AppNavbar>`.
- Document title: `useHead({ title: 'Tổng quan' })` in the page + `titleTemplate: '%s · Kho VTYT'` in nuxt.config `app.head`.
  No `definePageMeta({ title })` contract needed. `[...slug].vue` (A) also uses this same panel + ShellAppNavbar pattern.
- Don't add `resizable` to the panel (it then has no single root; breaks page transitions).

### M2. `typescript@7.0.2` breaks `nuxt typecheck`
TS 7 is the native (Go) port: `node_modules/typescript/lib` has only `tsc.js`/`getExePath` — no JS API, which vue-tsc needs.
Pin it: `bun add -d typescript@^5.9` (or `^6.0`). Agent A only.

### M3. `--ui-radius: 0.5rem` is too round
Nuxt UI derives `rounded-sm = r`, `rounded-md = 1.5r` (buttons, inputs, menu items), `rounded-lg = 2r` (cards, badges),
`rounded-xl = 3r`. With 0.5rem buttons get 12px and cards 16px. Prototype = 8px controls / 12px cards/menus.
Use `:root { --ui-radius: 0.3333rem; }` → md 8px, lg ≈ 10.7px (or 0.375rem → 9 / 12px). Pick 0.3333rem.

### M4. Slips table: paginate BEFORE grouping (parity with app.js)
Prototype: filter → sort → slice 10 per page → group the page rows by khoa (`app.js` L113-115).
TanStack order is grouping → sorting → expanding → **pagination**, so `getPaginationRowModel` + `grouping` counts
group header rows in the page size and splits groups across pages. Do this instead:
- In the page: `filtered` (search + status) → `sorted` (own `sort` ref: `{ k, d }`) → `pageRows = sorted.slice(...)` as computeds.
- `<UTable :data="pageRows" :grouping="['khoa']" :grouping-options="{ getGroupedRowModel: getGroupedRowModel() }" v-model:expanded="expanded">`
  with `expanded = ref<true | Record<string, boolean>>(true)` (all groups open), no `pagination-options`.
- Sort header buttons set the own `sort` ref (don't use TanStack `sorting` — it would only sort the current page).
- `UPagination v-model:page="page" :total="sorted.length" :items-per-page="10"`; reset `page = 1` on search/filter change.
- Group header row: render in the first column's `#…-cell` slot with `row.getIsGrouped()` (see docs "With grouped rows");
  `ui: { td: 'empty:p-0' }`. `groupedColumnMode: 'remove'` if khoa isn't a visible column.
- Import: `import { getGroupedRowModel } from '@tanstack/vue-table'` → add it as an explicit dependency
  (`bun add @tanstack/vue-table`, Agent A) — don't rely on bun hoisting a transitive dep.

### M5. Row selection must be keyed by slip id and survive paging
- `:get-row-id="(s) => String(s.n)"` — default ids are array indexes, so selection would jump rows on sort/page.
- `v-model:row-selection="selection"` (`Record<string, boolean>`), `:row-selection-options="{ enableRowSelection: r => !r.getIsGrouped() }"`
  so group rows (`khoa:<value>` ids) never land in the state; group checkbox:
  `modelValue: row.getIsAllSubRowsSelected() ? true : row.getIsSomeSelected() ? 'indeterminate' : false`, `onUpdate: v => row.toggleSelected(!!v)`.
- Selection of rows on other pages stays in the record (TanStack only mutates keys it touches). Bulk bar count =
  `Object.keys(selection).filter(k => selection[k]).length`; clear with `selection.value = {}`.
- Row click opens the slideover: use `@select="(e, row) => …"` on UTable, and in the checkbox cell stop propagation
  (`onClick: (e: Event) => e.stopPropagation()`) so ticking doesn't open the drawer.

## Recommended
- **`ssr: false`** in nuxt.config. Internal tool, sample data only; removes any SSR/CSR hydration mismatch risk
  (Dates, locale formatting, cookies). Prototype's `TODAY = new Date(2026,8,30)` and generator are deterministic — keep them so.
- Theme (A's main.css is close): keep `.dark` overrides of `--ui-bg*`, `--ui-border*`, `--ui-text*`, `--ui-primary/success/error/info/warning`.
  Overriding `--ui-<color>` with hex is supported (docs CSS Variables). Remove `secondary: 'amber'` (unused) or leave; harmless.
  `info: 'slate'` is right (slate-400 ≈ #90A1B9 ≈ prototype #8FA3BF). For dark-only also set
  `<UDashboardSearch :color-mode="false">` so the palette doesn't offer a light toggle.
- Fonts: A's `fonts.families` with `subsets: ['vietnamese','latin','latin-ext']` + explicit weights is correct
  (@nuxt/fonts by default only loads weight 400). Keep `@theme { --font-sans … }` too. Mono numbers: `font-mono tabular-nums`.
- Sidebar: `<UDashboardSidebar collapsible :ui="{ footer: 'border-t border-default' }">`; slots `#header`, `#default`, `#footer`
  receive `{ collapsed }` — pass `:collapsed="collapsed"` to `UNavigationMenu` and hide the budget meter when collapsed.
  Mobile drawer is built in (`mode` prop; default modal). Navbar shows the mobile toggle itself; no extra button.
- Nav: `UNavigationMenu orientation="vertical" :items="[[…section1], […section2]]"`; section headings `{ label: 'Kho', type: 'label' }`;
  badge `{ badge: pendingCount }` (computed so it updates). Use `to: '/ton-kho'` items so active state is automatic.
- Search: `<UDashboardSearch :groups="groups" />` in the layout; `UDashboardSearchButton` in the sidebar default slot.
  Shortcut default `meta_k` already maps to Ctrl+K on Windows. Groups: `{ id, label, items: [{ label, suffix, icon, to | onSelect }] }`.
- "Quét mã" button opening search (navbar lives in pages): share `const searchOpen = useState('search-open', () => false)`
  and bind `v-model:open="searchOpen"` on UDashboardSearch.
- Tabs: `<UTabs v-model="tab" :items="[{label:'Sắp hết hạn', value:'hsd'},{label:'Dưới tồn tối thiểu', value:'min'}]" :content="false" variant="pill" size="sm" />`.
- Slideover: `<USlideover v-model:open="open" side="right" :title="slip.no" :description="slip.khoa">` with `#body` / `#footer` slots.
  Reject reason: `UModal` + `UTextarea` + `autofocus`. Timeline: `<UTimeline :items="steps" :default-value="currentIndex" />`
  (items before the value render as completed).
- Toasts: `useToast().add({ title, color: 'success', icon: 'i-lucide-check' })`. Requires `<UApp>` (present).
- Bulk bar: plain `div` fixed bottom-center with `bg-elevated border border-accented rounded-lg shadow-lg` + `UButton`s; it's
  allowed custom layout (no Nuxt UI equivalent). Hide while slideover is open.
- Tồn kho: `:get-sub-rows="v => v.lots"` on a `VatTu & { lots }` tree, `v-model:expanded` initialised to
  `{ VT002: true, VT006: true, VT004: true }` with `:get-row-id` = `ma` for parents / `soLo` for children (ids must be unique).

## Watch out
- Auto-import names: `components/slips/SlipTable.vue` → `<SlipsSlipTable>`. Avoid stutter: name files `slips/Table.vue` → `<SlipsTable>`.
- `h(resolveComponent('UBadge'), …)` in column defs must run inside `setup` (top-level of `<script setup>` is fine; not in a util file).
- Don't put Dates in `useState` if `ssr` stays true unless you accept devalue serialisation (works, but mismatches with `new Date()`).
- `UCheckbox` model for indeterminate is the string `'indeterminate'`, not a prop.
- Windows/bun: run `bun run dev` from the repo root; if `.nuxt` gets stale after dep changes, delete `.nuxt` and `node_modules/.cache`,
  then `bunx nuxt prepare`. Don't run two dev servers on the same port (A and B): use `--port 3001` for the second.
- `app.config.ts` `ui.colors` values must be Tailwind palette names (or custom ones defined with all 50–950 shades in `@theme static`).
- Light mode: only `.dark` is overridden, so light uses zinc/amber defaults — acceptable per plan.
- Prototype `.app` floating window chrome (margin, rounded window, shadow): drop; `UDashboardGroup` is `fixed inset-0`.
