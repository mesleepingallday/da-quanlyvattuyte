# Design Brief – Hệ thống nhập & cấp phát Vật tư y tế (VTYT Kho)

> Dán file này vào đầu mọi phiên làm việc với AI design tool (Figma Make, Google Stitch, v0, Lovable, Uizard, Claude…).

## 1. Sản phẩm
Web app nội bộ cho **Bệnh viện quận Phú Nhuận**, số hóa quy trình QĐ 651/QĐ-BVPN: nhập kho, bảo quản, cấp phát vật tư tiêu hao y tế (VTTHYT) từ kho P.VTTBYT đến các khoa/phòng.
Ngôn ngữ giao diện: **tiếng Việt** (có dấu đầy đủ). Định dạng ngày `dd/MM/yyyy`, số `1.250`, tiền `12.500 ₫`.

## 2. Người dùng (vai trò)
| Vai trò | Việc chính |
|---|---|
| ĐD/KTV khoa | Lập phiếu lĩnh, theo dõi trạng thái, nhận hàng |
| Trưởng khoa | Duyệt phiếu lĩnh của khoa, duyệt dự trù |
| Thủ kho / Phụ kho | Xác nhận phiếu lĩnh, cấp phát, kiểm nhập, kiểm kê |
| Trưởng P.VTTBYT | Duyệt phiếu lĩnh, ký phiếu nhập, đánh giá hàng trả |
| Kế toán dược | Kiểm hóa đơn, lập phiếu nhập, đề nghị thanh toán |
| Ban Giám đốc | Xem dashboard, báo cáo |

## 3. Tính cách giao diện
Sạch, rõ, **mật độ thông tin cao nhưng dễ quét** (người dùng là nhân viên y tế bận rộn). Không trang trí thừa, không gradient, không emoji. Ưu tiên bảng dữ liệu, trạng thái hiện bằng badge màu.

## 4. Design tokens
| Token | Light | Dark | Dùng cho |
|---|---|---|---|
| primary | `#0E7C86` | `#3FB8C1` | Nút chính, link, menu đang chọn |
| primary-soft | `#E3F2F3` | `#133A3E` | Nền mục menu chọn, highlight |
| bg | `#F4F7F7` | `#0F1719` | Nền trang |
| surface | `#FFFFFF` | `#172225` | Card, bảng |
| border | `#DCE4E5` | `#2A393C` | Viền |
| text | `#15272B` | `#E4ECED` | Chữ chính |
| text-muted | `#5B6E72` | `#93A7AB` | Chữ phụ |

**Màu trạng thái phiếu (cố định toàn hệ thống):**
| Trạng thái | Màu |
|---|---|
| Nháp | xám `#6B7A7D` |
| Chờ xác nhận / Chờ duyệt | vàng hổ phách `#B7791F` |
| Đã duyệt | xanh dương `#2B6CB0` |
| Đã cấp phát / Hoàn tất | xanh lá `#2F855A` |
| Từ chối / Biệt trữ | đỏ `#C53030` |

**Cảnh báo hạn dùng:** < 30 ngày đỏ, < 90 ngày cam `#DD6B20`, còn lại bình thường.

- Font: **Be Vietnam Pro** (400/500/600/700); số liệu dùng `tabular-nums`.
- Cỡ chữ: 12 / 14 (body) / 16 / 20 / 24.
- Bo góc: 6px (input, nút), 10px (card). Lưới 8px. Bóng đổ rất nhẹ, chỉ cho card nổi/modal.

## 5. Layout chung
- Desktop 1440px: **sidebar trái 240px** (logo BV + menu theo vai trò + tên người dùng/vai trò ở đáy), **header 56px** (breadcrumb, ô tìm kiếm, chuông thông báo có số, avatar).
- Nội dung: tiêu đề trang + nút hành động chính góc phải, bên dưới là card chứa bộ lọc và bảng.
- Tablet: sidebar thu thành icon. Mobile: menu hamburger.

## 6. Component cần có
Button (primary/secondary/ghost/danger), Input, Select có tìm kiếm, DatePicker, Table (sort, phân trang, dòng chọn), Badge trạng thái, Tabs, Drawer, Modal xác nhận (có ô lý do khi Từ chối), Timeline duyệt, Toast, KPI card, Empty state.

## 7. Stack đích
Code sẽ viết bằng **Nuxt 3 + Nuxt UI (Tailwind)**. Nếu công cụ sinh code, yêu cầu Vue 3 `<script setup>` + Tailwind, hoặc HTML/Tailwind thuần.
