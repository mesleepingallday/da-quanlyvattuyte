# Thiết kế lại v3: "Kho VTYT" kiểu Apple

Trạng thái: đang làm trên nhánh `redesign/v3` · bắt đầu 01/10/2026

v3 thay hướng "Tem lô dark" (prototype v2). Bản v2 vẫn giữ ở `docs/prototype-v2/` và commit đầu tiên của nhánh này làm mốc so sánh.

## 1. Bài toán

Đưa đúng vật tư đến đúng khoa, nhanh, theo đúng lô (FEFO), có người chịu trách nhiệm ở từng bước, và không để lô nào hết hạn hay cạn kho mà không ai biết.

| Người dùng | Bối cảnh | Việc chính |
|---|---|---|
| ĐD khoa (Nguyễn Thị Lan, Khoa Nội) | Đứng ở khoa, bận, thường dùng điện thoại | Lập phiếu lĩnh, theo dõi phiếu, sửa phiếu bị trả |
| Trưởng khoa (Võ Thanh Bình) | Xen giữa giờ khám, điện thoại | Duyệt phiếu của khoa |
| Thủ kho (Trần Văn Hùng) | Đứng ở quầy kho, máy tính bảng hoặc PC, máy quét mã | Xác nhận phiếu, cấp phát theo lô, kiểm nhập |
| Trưởng P.VTTBYT (Lê Thị Kim Hạnh) | Bàn làm việc và điện thoại | Duyệt phiếu, ký phiếu nhập, quyết định lô hết hạn |
| Kế toán dược (Phạm Minh Tuấn) | Bàn làm việc, màn hình lớn | Đối chiếu hóa đơn, báo cáo xuất – nhập – tồn |

## 2. Nguyên tắc

1. **Việc trước, số liệu sau.** Màn đầu tiên của mọi vai trò trả lời "tôi cần làm gì bây giờ", kèm nút làm ngay trên từng dòng.
2. **Nhận ra bằng mắt.** Mỗi vật tư có ảnh sản phẩm thật; mỗi lô có thanh hạn dùng. Người dùng nhận ra "kim luồn 22G màu xanh" nhanh hơn đọc mã VT004.
3. **Một ngôn ngữ trạng thái.** Màu cho biết loại trạng thái (đang chờ, xong, bị từ chối, nháp), luôn đi kèm biểu tượng và chữ. Thanh 5 bước cho biết phiếu đang ở đâu. Nút hành động trên dòng nghĩa là "đến lượt bạn".
4. **Yên lặng mặc định, chỉ lên tiếng khi cần.** Ba tầng cảnh báo theo nghiên cứu: nghiêm trọng thì chặn thao tác (lô hết hạn, giá lệch hợp đồng), cảnh báo thì tô màu (HSD dưới 90 ngày, dưới tồn tối thiểu), còn lại để bình thường.
5. **Cho phép sửa sai.** Duyệt và xác nhận có Hoàn tác. Từ chối bắt buộc ghi lý do. Phiếu đang soạn tự lưu nháp.
6. **Một ứng dụng cho điện thoại và máy tính.** Thanh tab nổi ↔ thanh bên; mở trang chi tiết ↔ chia đôi danh sách và chi tiết; bảng trượt từ dưới ↔ hộp thoại giữa màn.
7. **Tay nghề ở chi tiết.** Vật liệu kính chỉ dùng cho thanh điều hướng; bo góc đồng tâm; đường kẻ mảnh; số căn phải và cùng độ rộng; chuyển động chỉ để trả lời thao tác.

## 3. Token

### Màu

| Token | Sáng | Tối | Dùng cho |
|---|---|---|---|
| Nền trang | `#F5F5F7` | `#000000` | Nền dưới cùng |
| Bề mặt | `#FFFFFF` | `#1C1C1E` | Nhóm danh sách, bảng trượt, hộp thoại |
| Ô ảnh | `#F2F2F5` | `#2C2C2E` | Nền sau ảnh vật tư |
| Mực | `#1D1D1F` | `#F5F5F7` | Chữ chính |
| Chì | `#6E6E73` | `#98989D` | Chữ phụ |
| Kẻ | `#E3E3E8` | `#38383A` | Đường phân cách |
| Xanh dược (tint) | `#0B7A55` | `#3DD39A` (chữ) / `#138A5E` (nền nút) | Nút chính, liên kết, bước đã xong |

Màu ngữ nghĩa (chữ dùng sắc đậm để đạt AA trên nền trắng):

| Ý nghĩa | Chấm/biểu tượng | Chữ (sáng) | Dùng cho |
|---|---|---|---|
| Nghiêm trọng | `#FF3B30` | `#D70015` | Lô hết hạn, HSD dưới 30 ngày, hết hàng, bị từ chối |
| Cảnh báo / đang chờ | `#FF9500` | `#B25000` | HSD dưới 90 ngày, dưới tồn tối thiểu, phiếu đang chờ người khác |
| Xong | xanh dược | xanh dược | Bước đã qua, đã cấp phát |
| Lạnh (2–8 °C) | `#32ADE6` | `#0071A4` | Chỉ hiện khi vật tư cần bảo quản mát hoặc lạnh |

Vì sao **xanh dược**: chữ thập xanh là ký hiệu nhà thuốc; nút chính của ứng dụng là Duyệt, Xác nhận, Cấp phát nên màu "đi tiếp" khớp với ý nghĩa. Xanh dương mặc định của Apple quá chung chung; v1 đã dùng xanh rêu "sổ kho", còn teal bị loại theo nghiên cứu.

### Chữ

Một họ chữ: **Be Vietnam Pro** (do người Việt thiết kế, dấu chồng rõ ở cỡ nhỏ). Bỏ IBM Plex Mono: mã phiếu, số lô và số lượng dùng chữ số cùng độ rộng (`tabular-nums`) của chính Be Vietnam Pro.

| Vai trò | Cỡ / dòng / độ đậm |
|---|---|
| Tiêu đề lớn | 34/40 · 700 · giãn chữ −0,022em (điện thoại 30/36) |
| Tiêu đề mục | 20/26 · 600 |
| Tiêu đề dòng | 16/22 · 600 |
| Nội dung | 15/22 (máy tính), 16/22 (điện thoại, tránh iOS phóng to ô nhập) |
| Phụ | 13/18 · 500 |
| Chú thích | 12/16 · 500 |

Viết hoa kiểu câu ở mọi nơi. Không có nhãn VIẾT HOA phía trên tiêu đề.

### Hình khối

Bo góc theo cấp, đồng tâm: nút và chip dạng viên thuốc (tròn hai đầu); ô nhập 12px; nhóm danh sách 20px; bảng trượt và hộp thoại 28px; ô ảnh bằng 1/4 cạnh. Bóng đổ chỉ dùng cho lớp nổi (thanh tab, bảng trượt, menu).

## 4. Bố cục

```
Máy tính (≥1024px)                          Điện thoại (<1024px)
┌──────────┬─────────────────────────┐     ┌──────────────────────┐
│ Kho VTYT │ Hôm nay          [Quét] │     │ Hôm nay         (TH) │
│ [Tìm ⌃K] │ Thứ Tư, 30 tháng 9      │     │ Thứ Tư, 30 tháng 9   │
│          │                         │     │ ┌──────────────────┐ │
│ Hôm nay  │ Cần bạn xử lý           │     │ │ việc + nút       │ │
│ Phiếu  5 │ ┌─────────────────────┐ │     │ └──────────────────┘ │
│ Tồn kho  │ │ việc + nút          │ │     │ ...                  │
│ Nhập kho │ └─────────────────────┘ │     │ ╭────────────────╮ ◯ │
│ Báo cáo  │ Lô cần chú ý            │     │ │ tab  tab  tab  │ ⌕ │
│ (người)  │                         │     │ ╰────────────────╯   │
└──────────┴─────────────────────────┘     └──────────────────────┘
```

- Nội dung căn trái, cột đọc tối đa ~880px ở Hôm nay; Phiếu lĩnh, Tồn kho, Nhập kho dùng **chia đôi** danh sách ↔ chi tiết trên máy tính (kiểu Mail), mở trang riêng trên điện thoại.
- Nút tròn cạnh thanh tab là việc chính của vai trò: Thủ kho quét mã, ĐD khoa lập phiếu, các vai trò khác tìm kiếm.

## 5. Màn hình

| Đường dẫn | Màn | Ghi chú |
|---|---|---|
| `/dang-nhap` | Đăng nhập | Mã nhân viên + mật khẩu; bản dùng thử chọn nhanh 5 người |
| `/chao-mung` | Chào mừng | Hiện một lần cho mỗi người; 3 điểm theo vai trò |
| `/` | Hôm nay | Việc cần làm theo vai trò, lô cần chú ý |
| `/phieu`, `/phieu/:so` | Phiếu lĩnh | Phân đoạn Cần xử lý / Đang xử lý / Đã xong; chi tiết có thanh 5 bước, vật tư, nhật ký |
| `/lap-phieu` | Lập phiếu lĩnh | Chọn vật tư theo ảnh, bước số lượng, cảnh báo tồn, lĩnh lại phiếu cũ |
| `/cap-phat/:so` | Cấp phát | Danh sách lấy hàng theo FEFO, quét số lô để xác nhận |
| `/kho`, `/kho/:ma` | Tồn kho | Ảnh, tồn so với tối thiểu, lô theo hạn dùng, lượng xuất 6 tháng |
| `/nhap-kho`, `/nhap-kho/:so` | Nhập kho | Kiểm nhập: giá so với hợp đồng, đạt / không đạt (biệt trữ) |
| `/bao-cao` | Báo cáo | Xuất – nhập – tồn, theo khoa, dự trù tháng; tải CSV mở bằng Excel |
| `/tai-khoan` | Tài khoản | Giao diện sáng/tối, đổi người dùng thử, đặt lại dữ liệu mẫu |
| `/in/:so` | Chứng từ xuất kho | Khổ A4 để in |

## 6. Ảnh

Ảnh vật tư tạo bằng Codex (`gpt-5.6-terra`, công cụ tạo ảnh có sẵn), nền trong suốt, cùng một bộ quy tắc chụp: góc 3/4 nhìn hơi từ trên, ánh sáng mềm từ trái, không chữ, không logo. Ảnh đặt trên ô nền xám nhạt (tối: xám đậm) nên dùng được cho cả hai chế độ. Khi đưa vào dùng thật, ảnh do bệnh viện chụp sẽ thay vào cùng chỗ; vật tư chưa có ảnh hiện biểu tượng theo nhóm.

## 7. Nhật ký quyết định

| Quyết định | Lý do |
|---|---|
| Sáng là mặc định, có tối và tự động theo hệ thống | Bệnh viện làm việc ban ngày dưới đèn trắng; v2 chỉ có nền tối |
| Bỏ thẻ KPI lớn và mã vạch trang trí ở trang đầu | Nghiên cứu: người vận hành cần biết việc phải làm, không cần số trang trí |
| Trạng thái "đến lượt bạn" là nút hành động trên dòng | Người dùng biết phải làm gì mà không cần đọc nhãn |
| Đã cấp phát hiện màu yên (dấu tích), không tô xanh cả dòng | Việc đã xong không cần giành sự chú ý |
| Ảnh sản phẩm là điểm nhấn duy nhất | Có công dụng (nhận dạng, tránh lấy nhầm cỡ) và làm sản phẩm trông hoàn thiện |
