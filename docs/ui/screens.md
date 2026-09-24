# Đặc tả màn hình (12 màn MVP)

Mỗi màn: **Mục đích · Vai trò · Bố cục · Dữ liệu · Hành động · Trạng thái đặc biệt · Đi tiếp**. Dữ liệu mẫu xem `sample-data.json`.

## S01 Đăng nhập
- Mục đích: vào hệ thống. Vai trò: tất cả.
- Bố cục: 2 cột. Trái là panel màu primary có tên hệ thống "Kho Vật tư y tế – BV quận Phú Nhuận". Phải là form.
- Dữ liệu: Tên đăng nhập, Mật khẩu, "Ghi nhớ".
- Hành động: Đăng nhập. Chế độ demo có thêm các nút "Đăng nhập nhanh" theo vai trò.
- Trạng thái: sai mật khẩu (thông báo đỏ dưới form).
- Đi tiếp: S02.

## S02 Dashboard
- Vai trò: tất cả; nội dung đổi theo vai trò.
- Bố cục: hàng 4 KPI card, bên dưới 2 cột: "Việc cần làm" (danh sách phiếu chờ tôi xử lý) và "Vật tư sắp hết hạn".
- KPI (thủ kho): Phiếu chờ xác nhận **3**, Sắp hết hạn ≤90 ngày **5 lô**, Dưới mức tồn tối thiểu **2**, Cấp phát tháng này **41 phiếu**.
- Hành động: bấm KPI mở danh sách đã lọc tương ứng.
- Trạng thái: không có việc thì hiện empty state "Không có phiếu nào chờ xử lý".

## S03 Danh mục vật tư
- Vai trò: Thủ kho, Admin.
- Bố cục: thanh lọc (ô tìm theo mã/tên, nhóm, BHYT/Thu phí), bảng, drawer thêm/sửa.
- Cột: Mã, Tên VTTHYT, ĐVT, Số ĐK, Nhóm, Điều kiện BQ (Phòng/Mát/Lạnh), BHYT, Tồn hiện tại, Tồn tối thiểu.
- Hành động: Thêm vật tư, Sửa, Ngừng sử dụng.

## S04 Tồn kho theo lô
- Vai trò: Thủ kho, Trưởng P.VTTBYT.
- Bố cục: bộ lọc kho (Kho chính / Tủ trực khoa…). Bảng nhóm theo vật tư, mở rộng ra từng lô.
- Cột lô: Số lô, HSD, Còn (ngày), SL tồn, Vị trí.
- Tô màu: HSD < 30 ngày đỏ, < 90 ngày cam. Lô biệt trữ có badge đỏ "Biệt trữ".

## S05 Lập phiếu lĩnh
- Vai trò: ĐD/KTV khoa.
- Bố cục: header phiếu (Khoa, Kho lĩnh, Ngày, Lý do/Y lệnh), bảng dòng giống mẫu giấy.
- Cột: STT, Mã, Tên VTTHYT (autocomplete), ĐVT, **Tồn khả dụng** (chỉ đọc), SL yêu cầu, Ghi chú.
- Hành động: Thêm dòng, Xóa dòng, Lưu nháp, **Gửi duyệt**.
- Trạng thái: SL yêu cầu > tồn thì hiện cảnh báo vàng (vẫn cho gửi).
- Đi tiếp: S07 của phiếu vừa tạo.

## S06 Danh sách phiếu lĩnh
- Vai trò: Khoa (chỉ thấy phiếu của khoa mình), Kho, Trưởng phòng.
- Bố cục: tab Tất cả / Chờ xác nhận / Chờ duyệt / Đã duyệt / Đã cấp phát / Từ chối (mỗi tab có số đếm).
- Cột: Số phiếu (PL-2025-0012), Ngày, Khoa, Số mặt hàng, Người lập, Trạng thái (badge).

## S07 Chi tiết & duyệt phiếu lĩnh
- Bố cục: trái (2/3) là thông tin phiếu và bảng vật tư; phải (1/3) là **timeline duyệt**: Lập → Trưởng khoa duyệt → Kho xác nhận → Trưởng P.VTTBYT duyệt → Cấp phát.
- Hành động đổi theo vai trò và trạng thái:
  - Kho: **Xác nhận** hoặc Trả lại khoa sửa.
  - Trưởng phòng: **Duyệt** hoặc **Từ chối** (modal bắt nhập lý do).
- Trạng thái: phiếu đã xử lý thì các nút bị ẩn.

## S08 Cấp phát (xuất kho)
- Vai trò: Thủ kho.
- Mỗi dòng vật tư có **lô gợi ý theo FEFO** (hết hạn trước xuất trước), ví dụ "Lô A2311 – HSD 15/03/2025 – lấy 20". Được sửa tay.
- Cột: Vật tư, SL duyệt, Lô xuất, HSD, SL phát.
- Hành động: **Xác nhận cấp phát** (trừ tồn), **In chứng từ xuất** (sang S09).

## S09 Bản in chứng từ xuất / phiếu lĩnh (A4)
- Quốc hiệu, tên BV, "CHỨNG TỪ XUẤT KHO", Số/ngày.
- Bảng: Mã hàng, Tên, ĐVT, SL, Đơn giá, Thành tiền, Tổng.
- 3 ô ký: Người phát · Người lĩnh · P.VTTBYT.

## S10 Kiểm nhập & phiếu nhập kho
- Vai trò: Thủ kho, Kế toán dược.
- Header: Nhà cung cấp, Hợp đồng/Gói thầu, Số hóa đơn, Ngày.
- Cột: Vật tư, Số lô, HSD, SL, **Đơn giá**, Giá hợp đồng, Đạt/Không đạt.
- Quy tắc: giá khác giá hợp đồng thì ô tô đỏ và có tooltip. Dòng "Không đạt" → vào biệt trữ.
- Hành động: Lưu sổ kiểm nhập, Chuyển kế toán, Trình ký.

## S11 Báo cáo xuất – nhập – tồn
- Bộ lọc: Tháng, Kho, Nhóm.
- Cột: Mã, Tên, ĐVT, Tồn đầu, Nhập, Xuất, Tồn cuối, Giá trị tồn.
- Hành động: Xuất Excel. Dòng tổng ở cuối.

## S12 Dự trù tháng
- Vai trò: Thủ kho (dự trù kho), Khoa (dự trù khoa).
- Cột: Tên, ĐVT, Tồn đầu, Nhập, Xuất, Tồn cuối, **SL gợi ý** (= TB xuất 3 tháng × 1,2 − tồn cuối), SL dự trù (sửa được), HSD gần nhất, Ghi chú.
- Hành động: Gửi duyệt. Ngoài ngày 1–5 thì hiện banner "Dự trù đột xuất".

## (Sau MVP) Chatbot AI
Nút tròn nổi góc phải dưới; panel 380px có lịch sử chat, gợi ý câu hỏi ("Tồn kho găng tay size M?", "Vật tư nào sắp hết hạn?").
