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

## 3. Hướng thẩm mỹ: "Sổ kho và con dấu đỏ"
Chất liệu lấy từ chính công việc của kho bệnh viện: **bìa sổ kho xanh rêu, giấy chứng từ, tem nhãn lô hàng và con dấu đỏ duyệt phiếu**. Giao diện là công cụ làm việc hằng ngày nên phải yên tĩnh, rõ ràng, mật độ thông tin cao. Chỉ có **một điểm nhấn đáng nhớ**: trạng thái phê duyệt thể hiện như **con dấu mực đỏ** trên phiếu (viền tròn/chữ nhật, hơi nghiêng 3–4°). Mọi thứ còn lại tiết chế.

Những điều **không** làm (đều là dấu hiệu của giao diện AI sinh hàng loạt):
- Không dùng xanh ngọc (teal) chung chung, không gradient, không emoji, không nền kem + chữ serif + màu đất nung.
- Không chia mọi thứ thành card bo góc giống hệt nhau có cùng một lớp bóng; bảng dữ liệu nằm phẳng trên trang.
- Không nhãn VIẾT HOA giãn chữ phía trên tiêu đề, không nối thông tin bằng dấu chấm giữa "A · B · C", không gắn "→" vào nút hay link.
- Không tô màu riêng một chữ trong tiêu đề. Không dùng font mono cho nhãn nhỏ.
- Không dùng hiệu ứng trượt/mờ dần cho từng khối khi tải trang.

## 4. Design tokens
| Token | Light | Dark | Dùng cho |
|---|---|---|---|
| ledger (primary) | `#1F5C4F` | `#7CC4AE` | Nút chính, menu đang chọn, link. Màu bìa sổ kho |
| ledger-soft | `#E4EEEA` | `#1A2F2A` | Nền mục đang chọn, ô gợi ý |
| paper (bg) | `#F5F6F2` | `#121715` | Nền trang, xám hơi ngả xanh, không phải màu kem |
| sheet (surface) | `#FFFFFF` | `#1A201E` | Vùng bảng, form |
| rule (border) | `#D6DBD3` | `#2C3531` | Đường kẻ bảng |
| ink (text) | `#1B2623` | `#E3E8E4` | Chữ chính |
| ink-muted | `#5E6B66` | `#98A59F` | Chữ phụ |
| stamp (đỏ dấu) | `#B3261E` | `#F2837A` | **Chỉ** dùng cho con dấu và lỗi nghiêm trọng |

**Trạng thái phiếu:** badge phẳng nền nhạt trong danh sách, **con dấu** ở trang chi tiết và bản in.
| Trạng thái | Màu | Chữ trên dấu |
|---|---|---|
| Nháp | xám `#6B746F` | Nháp |
| Chờ xác nhận / Chờ duyệt | hổ phách `#A86A00` | Chờ duyệt |
| Đã duyệt | xanh mực `#2A5DA8` | Đã duyệt |
| Đã cấp phát | xanh sổ `#1F5C4F` | Đã cấp phát |
| Từ chối / Biệt trữ | đỏ dấu `#B3261E` | Từ chối |

**Hạn dùng:** còn dưới 30 ngày thì chữ đỏ dấu kèm chữ "còn N ngày"; dưới 90 ngày thì hổ phách; còn lại để bình thường. Không dùng màu làm tín hiệu duy nhất, luôn có chữ đi kèm.

**Typography**
- Giao diện: **Lexend** (Google Fonts, hỗ trợ tiếng Việt, dễ đọc cho người đọc nhanh), 400/500/600. Số trong bảng dùng `tabular-nums`, căn phải.
- Chứng từ in (A4) và tiêu đề trên con dấu: **Noto Serif** 400/700, để gợi văn bản hành chính.
- Thang cỡ chữ (tỉ lệ 1,2): 12 / 14 (body) / 17 / 20 / 24 / 29. Viết hoa kiểu câu (sentence case) ở mọi nơi, trừ quốc hiệu và tiêu đề trên bản in.
- Dòng chữ tối đa khoảng 75 ký tự.

**Hình khối**
- Bo góc theo cấp bậc: 4px cho input và nút, 8px cho modal/drawer, 0 cho bảng.
- Bóng đổ chỉ dùng cho lớp nổi (modal, drawer, toast).
- Lưới 8px.

**Chuyển động:** chỉ một khoảnh khắc được dàn dựng. Khi bấm Duyệt hoặc Cấp phát, con dấu "đóng" xuống phiếu trong 180ms (scale 1,15 về 1, độ mờ 0 về 1). Tôn trọng `prefers-reduced-motion`.

**Giọng văn**
- Động từ rõ ràng, hành động giữ nguyên tên từ đầu đến cuối: nút "Cấp phát" dẫn tới toast "Đã cấp phát".
- Lỗi nói rõ sai ở đâu và cách sửa, không xin lỗi.
- Màn hình trống thì mời hành động, ví dụ "Chưa có phiếu nào. Lập phiếu lĩnh".

## 5. Layout chung
- Desktop 1440px: **sidebar trái 240px** nền `ledger` như gáy sổ (logo BV, menu theo vai trò, tên người dùng và vai trò ở đáy); **header 56px** nền `paper` (breadcrumb, ô tìm kiếm, chuông thông báo có số, avatar).
- Nội dung căn trái: tiêu đề trang, nút hành động chính ở góc phải, bên dưới là thanh lọc rồi bảng phẳng có đường kẻ `rule`.
- Tablet: sidebar thu thành icon. Mobile: menu hamburger.

## 6. Component cần có
Button (primary/secondary/ghost/danger), Input, Select có tìm kiếm, DatePicker, Table (sort, phân trang, dòng chọn), Badge trạng thái, **Con dấu trạng thái** (tròn và chữ nhật), Tabs, Drawer, Modal xác nhận (có ô lý do khi Từ chối), Timeline duyệt, Toast, KPI card, Empty state.

## 7. Stack đích
Code sẽ viết bằng **Nuxt 3 + Nuxt UI (Tailwind)**. Nếu công cụ sinh code, yêu cầu Vue 3 `<script setup>` + Tailwind, hoặc HTML/Tailwind thuần.
