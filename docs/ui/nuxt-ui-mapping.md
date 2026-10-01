# Ánh xạ màn hình sang Nuxt UI

Mục tiêu: thiết kế bám sát component có sẵn của Nuxt UI (v4, bản miễn phí đã gộp các component Pro), để lúc code chỉ cần lắp ráp, không phải tự vẽ lại.

## Điểm xuất phát
- **Template code:** `nuxt-ui-templates/dashboard`, khởi tạo bằng `npx nuxi init -t ui/dashboard`. Template có sẵn sidebar thu gọn được, panel, navbar, bảng (TanStack), trang cài đặt, thông báo, chế độ tối.
- **Figma:** bộ Nuxt UI Figma Kit trên Figma Community. Vẽ bằng đúng component trong kit này thì code ra sẽ khớp.
- **Theme (theo prototype v2 "Tem lô dark", đã áp dụng trong `app/`):** chỉ đổi token, không sửa component:
  - `app.config.ts`: `ui.colors` primary `amber` (#F2A900), neutral `zinc`, success `green`, info `slate`, warning `amber`, error `red`.
  - `nuxt.config.ts`: `colorMode.preference = 'dark'`, `ssr: false`; `fonts.families` Be Vietnam Pro (400-700) và IBM Plex Mono (400-600), subset `vietnamese`, `latin`, `latin-ext`.
  - `app/assets/css/main.css`: `@theme static` đặt `--font-sans`/`--font-mono`; khối `.dark` ghi đè `--ui-bg*` (#0B0D0F / #121519 / #181C21 / #1D2228), `--ui-border*` (#252A31 / #323943), `--ui-text*` (#ECEDEE / #9BA1A9 / #808892), `--ui-primary` #F2A900, success #3FB97B, error #F26C65, info #8FA3BF.
  - Bo góc: `--ui-radius: 0.3333rem` (nút và ô nhập 8px, thẻ khoảng 10,7px).
  - Số liệu: `font-mono tabular-nums`. Nền vạch mã của prototype bỏ.
  - Bố cục: layout chỉ có `UDashboardGroup` + `UDashboardSidebar` + `UDashboardSearch`; mỗi trang tự có `UDashboardPanel` và `ShellAppNavbar` (xem `docs/ui/agent-requests.md`).

## Layout chung
| Thiết kế | Nuxt UI |
|---|---|
| Khung app | `UDashboardGroup` |
| Sidebar xanh sổ | `UDashboardSidebar` (collapsible) + `UNavigationMenu` (orientation vertical) |
| Header 56px | `UDashboardNavbar` + `UDashboardSearchButton` + `UChip` (chuông) + `UUserMenu`/`UDropdownMenu` |
| Vùng nội dung | `UDashboardPanel` (có slot header/body) |
| Thanh lọc | `UDashboardToolbar` + `UInput`, `USelectMenu` |
| Tìm nhanh (Ctrl+K) | `UDashboardSearch` |

## Từng màn
| Màn | Component chính |
|---|---|
| S01 Đăng nhập | `UAuthForm` (fields + providers làm nút đăng nhập nhanh demo) |
| S02 Dashboard | `UPageList`/`UTable` cho việc cần làm, `UCard` cho cột tem lô, `UBadge` |
| S03 Danh mục vật tư | `UTable` (sort, pagination với `UPagination`), `USlideover` + `UForm` (Zod) để thêm/sửa |
| S04 Tồn kho theo lô | `UTable` với dòng mở rộng (`expanded` / `getSubRows`), `UBadge` cho hạn dùng |
| S05 Lập phiếu lĩnh | `UForm` + `UTable` có ô `UInputNumber`, `UInputMenu` (tìm vật tư), `UStepper` (5 bước) |
| S06 Danh sách phiếu | `UTabs` + `UTable`, `UBadge` trạng thái |
| S07 Chi tiết & duyệt | `UTimeline` (tiến trình duyệt), `UModal` (lý do từ chối), **component tự làm `StampBadge.vue`** (con dấu đỏ, điểm nhấn duy nhất) |
| S08 Cấp phát | `UTable` nhóm theo vật tư, `UAlert` khi thiếu hàng |
| S09 Chứng từ A4 | Trang in riêng, layout `print`, CSS `@media print`, không dùng component UI |
| S10 Kiểm nhập | `UForm`, `UTable` + `UInputNumber` (viền lỗi qua `color="error"`), `USwitch` Đạt/Không đạt, `UStepper` |
| S11 Báo cáo X-N-T | `UTable` có footer tổng, `UButton` Xuất Excel, `UPopover` + `UCalendar` chọn tháng |
| S12 Dự trù | `UTable` + `UInputNumber`, `UAlert` dự trù đột xuất, `UTooltip` giải thích công thức |
| Thông báo | `useToast()` + `UToast` |
| Chatbot (sau MVP) | `UChatPalette`, `UChatMessages`, `UChatPrompt` |

## Ghi chú cho AI design tool
Thêm câu này vào master prompt: *"Chỉ dùng các component có trong Nuxt UI v4 (UDashboardGroup, UDashboardSidebar, UDashboardPanel, UTable, UForm, UTabs, UTimeline, UStepper, UModal, USlideover, UBadge, UAlert). Không tạo component mới trừ con dấu trạng thái."*

Phần tùy biến riêng chỉ nằm ở theme và một component `StampBadge`. Mọi thứ khác là Nuxt UI gốc, nên phần code giao diện ước tính giảm được khoảng một nửa.
