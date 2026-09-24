## 6b. Kế hoạch wireframe & thiết kế UI (giai đoạn 2, tuần 4–5)

Mục tiêu: có một prototype Figma bấm thử được, đi hết 2 luồng chính để demo cho GVHD **trước khi code**. Sau đó bản thiết kế này là "hợp đồng" cho phần giao diện Nuxt UI.

### Quy trình 5 bước
1. **Sơ đồ màn hình (0,5 ngày):** vẽ sitemap và user flow theo từng vai trò (FigJam), bám theo các bước trong QĐ 651.
2. **Wireframe low-fi (1–2 ngày):** chỉ dùng khung xám, chưa có màu. Mỗi màn hình trả lời 3 câu hỏi: ai dùng, dữ liệu gì, hành động gì. Đưa GVHD góp ý ngay ở bước này.
3. **Design system mini (0,5 ngày):**
   - Dùng kit **Nuxt UI Figma Kit** (miễn phí trên Figma Community), để thiết kế khớp 1-1 với code.
   - Màu chủ đạo xanh y tế (teal/blue).
   - Màu trạng thái cố định cho mọi loại phiếu: Nháp xám, Chờ duyệt vàng, Đã duyệt xanh dương, Đã cấp phát xanh lá, Từ chối đỏ.
   - Font Inter hoặc Be Vietnam Pro (hiển thị tiếng Việt tốt).
   - Lưới 8px. Khung desktop 1440px, có thêm 1 khung tablet cho màn hình kho.
4. **Mockup hi-fi (2–3 ngày):** dựng từ component (Auto Layout + Variants cho nút, badge trạng thái, dòng bảng). Dùng **dữ liệu thật** lấy từ tài liệu: tên vật tư, số lô, hạn dùng, tên khoa.
5. **Prototype & demo (0,5 ngày):** nối các màn hình bằng Prototype, rồi quay video 2–3 phút hoặc trình chiếu trực tiếp bằng Present mode.

### Các màn hình chính (MVP, khoảng 12 màn)

| # | Màn hình | Vai trò | Điểm nhấn UI |
|---|---|---|---|
| 1 | Đăng nhập | Tất cả | Logo BV, chọn vai trò khi demo |
| 2 | Dashboard | Theo vai trò | Thẻ KPI (tồn kho, phiếu chờ duyệt, sắp hết hạn ≤90 ngày, tồn thấp), danh sách việc cần làm |
| 3 | Danh mục vật tư | Kho, Admin | Bảng có tìm kiếm và lọc theo nhóm, drawer thêm/sửa |
| 4 | Tồn kho theo lô | Kho | Nhóm theo vật tư rồi đến lô; tô màu hạn dùng: đỏ nếu <30 ngày, cam nếu <90 ngày |
| 5 | Lập phiếu lĩnh | ĐD khoa | Form dạng bảng dòng (chọn vật tư, hiện tồn khả dụng, nhập SL), giống mẫu giấy |
| 6 | Danh sách phiếu lĩnh | Khoa, Kho, Trưởng phòng | Tab theo trạng thái, có badge |
| 7 | Chi tiết và duyệt phiếu lĩnh | Kho, Trưởng P.VTTBYT | Timeline duyệt, nút Xác nhận/Duyệt/Từ chối (kèm lý do), cảnh báo nếu tồn thiếu |
| 8 | Cấp phát (xuất kho) | Kho | Hệ thống gợi ý lô theo FEFO, cho sửa tay; nút In chứng từ |
| 9 | Bản in chứng từ xuất / phiếu lĩnh | Kho | Khổ A4, bố cục giống mẫu trong QĐ |
| 10 | Kiểm nhập & phiếu nhập kho | Kho, Kế toán | Nhập lô, hạn dùng, giá; cảnh báo khi giá khác hợp đồng; tick "không đạt" để đưa vào biệt trữ |
| 11 | Báo cáo xuất-nhập-tồn | Kho, Kế toán, BGĐ | Bộ lọc tháng/kho, bảng và nút xuất Excel |
| 12 | Dự trù tháng | Kho, Khoa | Cột "SL gợi ý" tính sẵn, cho chỉnh sửa |
| (sau) | Chatbot AI | Tất cả | Nút nổi góc phải, panel chat |

Layout chung: sidebar trái (menu theo vai trò), header có ô tìm kiếm, chuông thông báo và avatar; nội dung đặt trong card.

### Kịch bản demo (5 phút, bấm trên prototype)
1. ĐD khoa Nội đăng nhập, lập phiếu lĩnh 3 vật tư rồi gửi.
2. Thủ kho thấy phiếu trong danh sách chờ, xác nhận.
3. Trưởng P.VTTBYT duyệt.
4. Thủ kho cấp phát theo lô FEFO rồi in chứng từ.
5. Dashboard cập nhật số tồn; xem báo cáo xuất-nhập-tồn.

### Phương án bổ sung, làm nhanh (tùy chọn)
Nếu chưa quen Figma, mình có thể dựng một **prototype HTML bấm được**: 12 màn hình với dữ liệu mẫu, chia sẻ bằng link để demo ngay. Bạn dùng nó làm bản tham chiếu khi vẽ lại trong Figma, hoặc chụp màn hình đưa vào chương Thiết kế.

### Sản phẩm bàn giao
- File Figma (các trang: Flow, Wireframe, Design System, Mockup, Prototype).
- Ảnh PNG các màn hình đưa vào báo cáo chương 4.
- Video demo.

