# Prompt cho AI design tool

## Cách dùng (quan trọng)
1. **Mở phiên mới → dán `design-brief.md` trước** (hoặc dán Master prompt bên dưới).
2. **Sinh từng màn một**: dán prompt của màn đó, kèm đoạn tương ứng trong `screens.md`. Công cụ sinh 1 màn chất lượng hơn hẳn 12 màn một lúc.
3. **Giữ nhất quán**: sau màn đầu (S02 Dashboard), nói "dùng đúng sidebar/header/tokens như màn trước cho mọi màn sau".
4. **Sửa bằng câu cụ thể**: "Cột SL căn phải, dùng tabular-nums", tốt hơn "làm đẹp hơn".
5. Dùng dữ liệu trong `sample-data.json`, không dùng lorem ipsum.

| Công cụ | Hợp cho | Mẹo |
|---|---|---|
| **Figma Make / First Draft** | Ra file Figma để nộp và chỉnh sửa | Dán brief, sinh từng frame 1440px |
| **Google Stitch** | Sinh nhanh nhiều màn, export sang Figma | Chọn chế độ Web, dán prompt từng màn |
| **v0 (Vercel)** | Sinh code Tailwind có thể tái dùng | Thêm "Vue 3 + Tailwind" hoặc chuyển từ React sang |
| **Claude (Artifacts)** | Prototype HTML bấm được | Dán brief + screens, yêu cầu "single-file clickable prototype" |

---

## Master prompt
```
Bạn là UI/UX designer cho phần mềm quản lý bệnh viện. Thiết kế web app nội bộ "Kho Vật tư y tế – BV quận Phú Nhuận" (tiếng Việt), desktop 1440px.
Tuân thủ design brief sau: [DÁN design-brief.md]
Layout chung: sidebar trái 240px (logo, menu: Tổng quan, Phiếu lĩnh, Cấp phát, Nhập kho, Tồn kho, Danh mục vật tư, Dự trù, Báo cáo), header 56px (breadcrumb, tìm kiếm, chuông, avatar).
Phong cách: sạch, mật độ cao, dễ quét, không gradient, không emoji; trạng thái dùng badge màu theo brief.
Dùng dữ liệu thật: [DÁN sample-data.json]
Bắt đầu với màn Dashboard cho vai trò Thủ kho.
```

## Prompt từng màn
**S01 Đăng nhập**
```
Màn đăng nhập 2 cột: trái panel màu #0E7C86 với tên hệ thống và dòng "Số hóa quy trình QĐ 651/QĐ-BVPN"; phải form Tên đăng nhập, Mật khẩu, Ghi nhớ, nút Đăng nhập, và hàng nút "Đăng nhập nhanh (demo)": ĐD khoa, Thủ kho, Trưởng P.VTTBYT, Kế toán.
```
**S02 Dashboard (Thủ kho)**
```
Hàng 4 KPI card: Phiếu chờ xác nhận 3 | Lô sắp hết hạn (≤90 ngày) 5 | Dưới tồn tối thiểu 2 | Phiếu cấp phát tháng này 41. Dưới: card "Việc cần làm" (bảng phiếu PL-2025-0012 Khoa Nội 3 mặt hàng badge "Chờ xác nhận"…) và card "Sắp hết hạn" (Que thử đường huyết lô QT2403 HSD 08/10/2026 còn 14 ngày, tô đỏ).
```
**S03 Danh mục vật tư**
```
Trang danh mục: tiêu đề + nút "Thêm vật tư". Thanh lọc: tìm mã/tên, Nhóm, Điều kiện bảo quản. Bảng cột Mã, Tên VTTHYT, ĐVT, Nhóm, Bảo quản (chip Phòng/Mát/Lạnh), Tồn, Tồn tối thiểu (tô cam nếu tồn < min). Có drawer bên phải để thêm/sửa.
```
**S04 Tồn kho theo lô**
```
Bảng tồn kho nhóm theo vật tư, mỗi vật tư mở rộng ra các lô: Số lô, HSD, Còn (ngày), SL, trạng thái. HSD <30 ngày chữ đỏ, <90 ngày cam. Bộ lọc Kho: Kho chính / Tủ trực Khoa Nội.
```
**S05 Lập phiếu lĩnh**
```
Form "Phiếu lĩnh vật dụng y tế tiêu hao" giống mẫu giấy: header Khoa (Khoa Nội), Kho lĩnh, Ngày, Lý do. Bảng dòng: STT, Mã, Tên (autocomplete), ĐVT, Tồn khả dụng (xám, chỉ đọc), SL yêu cầu (input), Ghi chú, nút xóa dòng. Nút "+ Thêm dòng". Dưới cùng: Lưu nháp, Gửi duyệt (primary). Dòng SL > tồn có cảnh báo vàng.
```
**S06 Danh sách phiếu lĩnh**
```
Tabs có số đếm: Tất cả 24, Chờ xác nhận 3, Chờ duyệt 2, Đã duyệt 1, Đã cấp phát 17, Từ chối 1. Bảng: Số phiếu, Ngày, Khoa, Số mặt hàng, Người lập, Trạng thái (badge màu theo brief), nút Xem.
```
**S07 Chi tiết & duyệt phiếu**
```
Layout 2/3 – 1/3. Trái: thông tin phiếu PL-2025-0012 + bảng vật tư. Phải: timeline dọc 5 bước (Lập phiếu ✓, Trưởng khoa duyệt ✓, Kho xác nhận ● hiện tại, Trưởng P.VTTBYT duyệt, Cấp phát) có tên người + giờ. Thanh hành động dưới: "Trả lại khoa" (secondary), "Xác nhận" (primary). Thêm biến thể modal "Từ chối" có textarea lý do bắt buộc.
```
**S08 Cấp phát**
```
Màn cấp phát cho phiếu đã duyệt: mỗi dòng vật tư hiển thị lô gợi ý theo FEFO (chip "FEFO"): Lô, HSD, SL lấy; có thể tách nhiều lô. Nút "Xác nhận cấp phát" và "In chứng từ xuất".
```
**S09 Chứng từ xuất kho (A4)**
```
Trang in A4 trắng đen: "BỆNH VIỆN QUẬN PHÚ NHUẬN / PHÒNG VẬT TƯ – TBYT", tiêu đề "CHỨNG TỪ XUẤT KHO", Số, Ngày, Kho xuất, Phòng nhận. Bảng: STT, Mã hàng, Tên, ĐVT, SL, Đơn giá, Thành tiền, dòng Tổng cộng. 3 cột ký: Người phát, Người lĩnh, P.VTTBYT.
```
**S10 Kiểm nhập & phiếu nhập kho**
```
Header: Nhà cung cấp, Gói thầu/Hợp đồng, Số hóa đơn, Ngày. Bảng: Vật tư, Số lô, HSD, SL, Đơn giá, Giá HĐ, Kết quả (toggle Đạt/Không đạt). Ô đơn giá lệch giá HĐ viền đỏ + tooltip "Lệch giá hợp đồng". Dòng Không đạt có badge "Biệt trữ". Nút: Lưu sổ kiểm nhập, Chuyển kế toán.
```
**S11 Báo cáo xuất-nhập-tồn**
```
Bộ lọc Tháng 09/2026, Kho chính. Bảng: Mã, Tên, ĐVT, Tồn đầu, Nhập, Xuất, Tồn cuối, Giá trị tồn (₫), số căn phải tabular-nums, dòng tổng in đậm. Nút "Xuất Excel".
```
**S12 Dự trù tháng**
```
Bảng dự trù tháng 10/2026: Tên, ĐVT, Tồn đầu, Nhập, Xuất, Tồn cuối, SL gợi ý (nền primary-soft, có icon info giải thích công thức), SL dự trù (input), HSD gần nhất, Ghi chú. Nút Gửi duyệt.
```
