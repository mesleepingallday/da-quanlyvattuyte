# Plan: port prototype v2 ("Tem lô dark") to Nuxt UI

Status: approved for execution · 2026-10-01

## Current state
- No Nuxt app exists. The only running UI is the static prototype `docs/prototype-v2/` (vanilla `index.html` + `styles.css` + `app.js`, ~670 lines), served by `live-server`.
- `docs/lo-trinh.md` already commits to Nuxt + Nuxt UI; `docs/ui/nuxt-ui-mapping.md` maps screens → components. That mapping's theme (green `ledger`, Lexend) is **outdated**: the source of truth for look & feel is prototype v2 (dark, amber accent, Be Vietnam Pro + IBM Plex Mono).
- Package manager: **bun** (bun.lock present, bun installed). Node 26.

## Goal
A Nuxt 4 + Nuxt UI v4 app at the repo root that reproduces prototype v2's two working screens and shell **using Nuxt UI components and theme tokens only**, with custom components limited to the domain-specific bits (lot "tem" label/barcode, stamp). Behaviour parity with `app.js` (filter, sort, paginate, group, select + bulk approve, detail drawer with approve/reject/issue, toasts, role switcher, Ctrl+K). The prototype stays in `docs/prototype-v2/` as the visual reference; do not delete it.

## Stack (Nuxt UI ecosystem)
- `nuxt` 4, `@nuxt/ui` v4 (includes Tailwind v4, `@nuxt/icon`, `@nuxt/fonts`, color-mode)
- Icons: `@iconify-json/lucide` (`i-lucide-*`), replacing the inline SVG sprite
- `@vueuse/nuxt` (shortcuts, storage), `zod` (forms later)
- `typescript`, `vue-tsc`; `@nuxt/eslint` optional
- Starting point: the official dashboard template structure (`nuxt-ui-templates/dashboard`), but scaffold minimally — do not import its demo pages.

## Layout of the repo after the change
```
nuxt.config.ts            modules: @nuxt/ui, @vueuse/nuxt; css: ~/assets/css/main.css
app/app.config.ts         ui.colors.primary='amber', neutral='zinc' (tune), component defaults
app/assets/css/main.css   @import "tailwindcss"; @import "@nuxt/ui"; @theme fonts + --ui-* overrides
app/app.vue               <UApp> + <NuxtLayout><NuxtPage/>
app/layouts/default.vue   shell (owner: Agent A)
app/pages/index.vue       Tổng quan (owner: Agent B)
app/pages/ton-kho.vue     Tồn kho theo lô (owner: Agent B)
app/pages/[...slug].vue   "Sắp có" placeholder for other nav items (owner: Agent A)
app/components/shell/*    (A)    app/components/slips/*, lots/*, LotLabel.vue, Barcode.vue, StampBadge.vue (B)
app/utils/format.ts       nf, money, fd, days, TODAY (B)
app/data/sample.ts        VT, LO, LOC, KHOA, P, STEPS, SLIPS generator ported verbatim from app.js (B)
app/types/index.ts        VatTu, Lo, Phieu, PhieuStatus... (B)
app/composables/useSlips.ts   reactive slip store: status changes, pending count (B; A reads pendingCount for nav badge)
app/composables/useRole.ts    current role (A)
```
Root `package.json`: keep `vtyt-kho`; scripts `dev`=`nuxt dev`, `build`, `preview`, `postinstall`=`nuxt prepare`, `typecheck`=`nuxt typecheck`; move old script to `proto`=`live-server docs/prototype-v2 --port=5174 --no-browser`. Add `.nuxt/ .output/ .data/` to `.gitignore`.

## Theme mapping (prototype token → Nuxt UI)
| Prototype | Nuxt UI |
|---|---|
| dark only, `--bg-app #0B0D0F` … | `colorMode` preference `dark` (keep light working but not polished); `--ui-bg`, `--ui-bg-muted`, `--ui-bg-elevated`, `--ui-border`, `--ui-text`, `--ui-text-muted`, `--ui-text-dimmed` under `.dark` set to prototype values |
| `--amber #F2A900` | `primary: 'amber'`; set `--ui-primary` in `.dark` to `#F2A900` |
| green / red / blue | `success`, `error`, `info` (info ≈ slate-blue `#8FA3BF` via custom palette or `neutral`) ; amber = `warning` |
| radius 8px | `--ui-radius: 0.5rem` |
| Be Vietnam Pro / IBM Plex Mono (vietnamese subset) | `@theme { --font-sans: 'Be Vietnam Pro', ...; --font-mono: 'IBM Plex Mono', ... }` — `@nuxt/fonts` resolves them |
| `.mono` tabular nums | utility `font-mono tabular-nums` |
| barcode background pattern | drop (or a single `bg-[url()]` on the body, optional) |

## Component mapping
| Prototype piece | Nuxt UI |
|---|---|
| `.app` window, `.side`, `.main` | `UDashboardGroup` › `UDashboardSidebar` (collapsible, resizable off) + `UDashboardPanel` per page |
| brand + search box | sidebar `#header` slot; `UDashboardSearchButton` |
| nav sections + badge | `UNavigationMenu orientation="vertical"` with grouped items (`type:'label'`), `badge` = pending slip count |
| budget meter | `UProgress` + text in sidebar `#footer` |
| "Lập dự trù" button | `UButton color="neutral" variant="outline" block` |
| user/role switcher | `UDropdownMenu` + `UUser`/`UAvatar`; checkbox items for roles; toast on change |
| top bar (title, back/forward, Quét mã, Nhập kho, Lọc, Xuất Excel) | `UDashboardNavbar` (title, `#leading` with `UDashboardSidebarCollapse`, `#right` buttons + `UKbd`) |
| Ctrl+K | `UDashboardSearch` (groups: pages + slips + lots) via `defineShortcuts` built in |
| filter menu | `USelect`/`UDropdownMenu` in `UDashboardToolbar` on Tổng quan |
| tabs Sắp hết hạn / Dưới tối thiểu | `UTabs` (variant `pill`, content false) |
| exception cards (crit spans wider) | `UPageGrid`/CSS grid of `UCard` or `UPageCard`; severity via `UBadge` + text color tokens |
| slips table (group by khoa, select, sort, paginate) | `UTable` with `grouping` (TanStack `getGroupedRowModel`), row selection (`UCheckbox` column), sortable headers, `UPagination`; status `UBadge` |
| bulk bar | fixed bar component using `UButton`s (show when selection > 0) |
| detail drawer | `USlideover` (side right) ; meta grid; items `UTable`; approvals `UTimeline`; footer actions `UButton`; reject reason `UModal` + `UTextarea` |
| toasts | `useToast()` |
| tồn kho grouped rows | `UTable` with `getSubRows` / `expanded`; lot chip = `UBadge variant="outline"` font-mono; quarantined qty `line-through` |
| "Sắp có" ticket | custom `LotLabel.vue` + `Barcode.vue` inside `UEmpty` or centered `UCard` |
| stamp (S07 later) | custom `StampBadge.vue` (only other custom visual) |

Rule: no hand-written CSS classes for things Nuxt UI provides. Custom CSS is allowed only in `main.css` tokens and the three custom components. Use `ui` prop / `app.config.ts` for tweaks.

## Work split
**Agent A — foundation & shell** (starts first; B must not run install or touch these files)
1. Scaffold with bun: `nuxt`, `@nuxt/ui`, `@iconify-json/lucide`, `@vueuse/nuxt`, `typescript`, `vue-tsc`, `zod`. Update `package.json`, `.gitignore`, `nuxt.config.ts`, `app/app.vue`, `app/app.config.ts`, `app/assets/css/main.css` (theme above).
2. As soon as the scaffold builds, create `app/.scaffold-ready` (empty marker) so B can start running the dev server.
3. `layouts/default.vue` with full shell (sidebar, nav, badge, meter, role menu, navbar actions with toasts, `UDashboardSearch`), `useRole`, `[...slug].vue` placeholder (may use B's `LotLabel` once it exists; until then a `UEmpty`).
4. Mobile: sidebar becomes the built-in mobile drawer.
5. Verify: `bun run build` and `bunx nuxt typecheck` pass; pages load in dev without console errors.

**Agent B — screens & domain components**
1. Immediately (no deps needed): port data/types/format utils and the `useSlips` composable (`useState`-based so state survives navigation; expose `slips`, `pendingCount`, `setStatus(n, st)`, `bulkApprove(ids)`).
2. Build `Barcode.vue`, `LotLabel.vue`, `StampBadge.vue`.
3. After `app/.scaffold-ready` exists: `pages/index.vue` (cards + slips table + bulk bar + slideover detail + reject modal) and `pages/ton-kho.vue`.
4. Each page wraps content in `UDashboardPanel` with its own `UDashboardNavbar`? → **No**: A's layout owns the navbar; pages render panel body only. Agree via `definePageMeta({ title })` read by the layout.
5. Verify parity against `docs/prototype-v2` behaviour list in its README.

**Advisor (Opus)** — reviews this plan before execution, answers questions, reviews the final diff for Nuxt UI v4 API correctness, a11y, and parity.

## Done when
- `bun install && bun run dev` serves the app; `bun run build` and typecheck pass.
- Tổng quan and Tồn kho behave like the prototype; other nav items show "Sắp có".
- `docs/ui/nuxt-ui-mapping.md` theme section updated to amber/dark/Be Vietnam Pro; prototype README notes `bun run proto`.
- No commit is made by agents; the coordinator reviews and commits.
