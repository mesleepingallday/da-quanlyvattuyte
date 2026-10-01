# Kho VTYT – bản mẫu giao diện v2

Lưu trữ. Giao diện hiện tại là v3 (xem `docs/ui/redesign-v3.md`); bản này giữ lại để so sánh trước/sau.

Bản mẫu tĩnh (HTML + CSS + JS thuần, không cần build) cho hệ thống quản lý vật tư y tế, BV quận Phú Nhuận.

## Cách chạy

Chọn một trong ba cách:

1. Dùng live-server (tự tải lại khi sửa file), chạy ở thư mục gốc repo:
   ```
   bun install && bun run proto
   ```
   Mở http://localhost:5174 (cổng 5173 và 3000 để cho ứng dụng Nuxt `bun run dev`)
2. Dùng Python:
   ```
   python3 -m http.server 5173 -d docs/prototype-v2
   ```
   Mở http://localhost:5173
3. Mở trực tiếp file `docs/prototype-v2/index.html` bằng trình duyệt (cần mạng để tải phông Be Vietnam Pro và IBM Plex Mono).

## Cấu trúc

- `index.html` – khung trang, thanh bên, thanh tác vụ, các biểu tượng SVG.
- `styles.css` – toàn bộ giao diện (token màu, bo góc, bảng, thẻ cảnh báo, ngăn chi tiết, responsive).
- `app.js` – dữ liệu mẫu, router theo hash, hiển thị màn hình, ngăn chi tiết, lọc, sắp xếp, phân trang.

## Màn hình hoạt động

- `#tong-quan` – Lô cần chú ý (tab Sắp hết hạn / Dưới tồn tối thiểu) và bảng Phiếu lĩnh theo khoa: tìm kiếm, lọc trạng thái, sắp xếp, phân trang, chọn nhiều và duyệt hàng loạt, ngăn chi tiết phiếu với duyệt / từ chối / cấp phát.
- `#ton-kho` – Tồn kho theo lô, nhóm theo vật tư, tìm theo tên hoặc số lô.
- Các mục còn lại trong menu hiển thị màn hình "Sắp có".
- Phím tắt: `Ctrl K` để tìm kiếm nhanh; đổi vai trò ở góc dưới thanh bên.
