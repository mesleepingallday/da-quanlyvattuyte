# Prompt cho AI design tool

Viết theo nguyên tắc của skill `frontend-design` (`.agents/skills/frontend-design/SKILL.md`):
- Bám vào chất liệu thật của chủ đề.
- Chỉ có **một** điểm nhấn đáng nhớ.
- Tránh các lối mặc định của giao diện AI.
- Làm hai lượt: lên kế hoạch thiết kế, rồi mới dựng.

## Cách dùng
1. Mở phiên mới. Dán **Master prompt** trước, kèm toàn văn `design-brief.md`.
2. **Sinh từng màn một**, bắt đầu từ S02 Dashboard. Sau khi có màn đầu, dán câu: *"Giữ nguyên sidebar, header, tokens và cách dùng con dấu của màn trước cho mọi màn sau."*
3. Mỗi màn sinh xong thì dán **Prompt polish** để công cụ tự soát lỗi và sửa một lượt.
4. Sửa bằng câu cụ thể. Ví dụ: *"Cột SL căn phải, dùng tabular-nums"* hiệu quả hơn *"làm đẹp hơn"*.
5. Công cụ nào hiểu tiếng Anh tốt hơn thì dùng **Master prompt (English)**, nhưng giữ nguyên chữ trên giao diện bằng tiếng Việt.

| Công cụ | Hợp cho | Mẹo |
|---|---|---|
| **Figma Make / First Draft** | Ra file Figma để nộp và chỉnh sửa | Mỗi màn là một frame 1440px |
| **Google Stitch** | Sinh nhanh nhiều màn, export sang Figma | Chế độ Web; dán Master prompt một lần rồi dán prompt từng màn |
| **v0** | Sinh code Tailwind tái dùng được | Thêm "Vue 3 + Tailwind, không dùng React" hoặc chuyển đổi sau |
| **Claude** | Prototype HTML bấm được | Yêu cầu "single-file clickable prototype", dán kèm `screens.md` |

---

## Master prompt (tiếng Việt)
```
VAI TRÒ
Bạn là trưởng nhóm thiết kế của một studio. Khách hàng đã từ chối các phương án trông như template; họ cần một bản sắc riêng cho đúng sản phẩm này.

BỐI CẢNH
Web app nội bộ "Kho Vật tư y tế" của Bệnh viện quận Phú Nhuận, số hóa quy trình QĐ 651/QĐ-BVPN: khoa lập phiếu lĩnh, kho xác nhận, Trưởng P.VTTBYT duyệt, kho cấp phát theo lô hết hạn trước (FEFO), kiểm nhập hàng, báo cáo xuất – nhập – tồn.
Người dùng là điều dưỡng, thủ kho và kế toán. Họ bận, làm việc với bảng số liệu nhiều giờ liền và cần quét thông tin thật nhanh.
Mọi chữ trên giao diện bằng tiếng Việt có dấu, viết hoa kiểu câu. Ngày dạng dd/MM/yyyy, số dạng 1.250, tiền dạng 12.500 ₫.

HƯỚNG THẨM MỸ: "Sổ kho và con dấu đỏ"
- Chất liệu: bìa sổ kho xanh rêu, giấy chứng từ, tem nhãn lô hàng, con dấu mực đỏ.
- Điểm nhấn duy nhất: trạng thái phê duyệt hiện như con dấu đỏ hơi nghiêng trên phiếu. Mọi thứ khác yên tĩnh.
- Sidebar nền xanh sổ #1F5C4F như gáy sổ. Nền trang #F5F6F2. Bảng phẳng, kẻ dòng #D6DBD3, bo góc 0.
- Font Lexend cho giao diện; Noto Serif cho bản in và chữ trên con dấu. Số trong bảng căn phải, tabular-nums.
- Tokens đầy đủ: [DÁN design-brief.md]

HỆ COMPONENT
Chỉ dùng component có trong Nuxt UI v4 (UDashboardGroup, UDashboardSidebar, UDashboardPanel, UDashboardNavbar, UTable, UForm, UTabs, UTimeline, UStepper, UModal, USlideover, UBadge, UAlert, UAuthForm). Chỉ riêng con dấu trạng thái được tự thiết kế. Xem docs/ui/nuxt-ui-mapping.md.

RÀNG BUỘC (không được làm)
- Không dùng teal chung chung, gradient hay emoji. Không chia mọi thứ thành card bo góc giống nhau có cùng bóng đổ.
- Không đặt nhãn VIẾT HOA giãn chữ trên tiêu đề, không nối "A · B · C", không gắn "→" vào nút, không tô màu riêng một chữ trong tiêu đề, không dùng font mono cho nhãn nhỏ.
- Không để màu là tín hiệu duy nhất: hạn dùng đỏ phải có chữ "còn 14 ngày".
- Không dùng lorem ipsum. Dùng dữ liệu thật: [DÁN sample-data.json]

QUY TRÌNH
Trước khi vẽ, viết kế hoạch 5 dòng: màu, chữ, bố cục (kèm ASCII wireframe), điểm nhấn, những gì cố tình KHÔNG làm. Tự soát xem kế hoạch có giống một dashboard mặc định không; nếu có thì sửa lại. Sau đó mới dựng.

ĐẦU RA
Desktop 1440px, có thể xem trên tablet. Layout: sidebar 240px (menu: Tổng quan, Lập phiếu lĩnh, Phiếu lĩnh, Cấp phát, Kiểm nhập & nhập kho, Tồn kho theo lô, Danh mục vật tư, Dự trù tháng, Báo cáo X-N-T), header 56px (breadcrumb, tìm kiếm, chuông thông báo, avatar).
Bắt đầu với màn Dashboard cho vai trò Thủ kho.
```

## Master prompt (English)
```
ROLE: Design lead at a studio known for distinct identities; the client rejected templated proposals.
PRODUCT: Internal web app "Kho Vật tư y tế" (medical supplies warehouse) for Phu Nhuan District Hospital, Vietnam. Digitizes SOP 651: ward nurses request supplies (phiếu lĩnh) → storekeeper confirms → head of supplies dept approves → storekeeper issues stock by earliest-expiry lot (FEFO) → monthly in/out/balance report. Users are busy nurses, storekeepers and accountants scanning dense tables all day.
ALL UI COPY MUST BE VIETNAMESE with full diacritics, sentence case, dates dd/MM/yyyy, numbers 1.250, money 12.500 ₫.
AESTHETIC: "Ledger and red stamp". Materials: moss-green warehouse ledger covers, paper forms, lot labels, red ink approval stamps. The ONE memorable element: approval status rendered as a slightly rotated red-ink stamp on the slip. Everything else calm and disciplined. Sidebar #1F5C4F like a ledger spine; page #F5F6F2; flat ruled tables (#D6DBD3, radius 0); Lexend for UI, Noto Serif for print forms and stamp text; right-aligned tabular numbers. Tokens: [PASTE design-brief.md]
DO NOT: generic teal, gradients, emoji, identical rounded cards with the same shadow, tracked uppercase eyebrows, "A · B · C" meta strings, "→" on buttons, single highlighted word in headings, monospace for small labels, color as the only signal.
PROCESS: First write a 5-line design plan (color, type, layout with ASCII wireframe, the one accent, what you deliberately avoid). Check it against a generic dashboard and revise. Then build.
COMPONENTS: use only Nuxt UI v4 components (UDashboardGroup, UDashboardSidebar, UDashboardPanel, UTable, UForm, UTabs, UTimeline, UStepper, UModal, USlideover, UBadge, UAlert, UAuthForm); the approval stamp is the only custom component.
DATA: use only this sample data: [PASTE sample-data.json]
OUTPUT: 1440px desktop, tablet-friendly. Start with the Dashboard for the Storekeeper role.
```

## Prompt polish (dán sau mỗi màn đã sinh)
```
Soát lại màn vừa làm như một design lead khó tính, rồi sửa luôn:
1. Điểm nhấn duy nhất (con dấu/màu đỏ dấu) có bị dùng lan ra chỗ khác không? Nếu có thì bỏ.
2. Còn dấu hiệu template nào không: card giống hệt nhau, nhãn viết hoa, "A · B · C", "→", gradient, emoji?
3. Số liệu có căn phải và tabular-nums không? Ngày có đúng dd/MM/yyyy không?
4. Chữ trên nút có phải động từ nói đúng việc sẽ xảy ra không ("Cấp phát", không phải "Submit")? Toast có dùng đúng động từ đó ("Đã cấp phát") không?
5. Có trạng thái rỗng và trạng thái lỗi viết rõ cách xử lý không?
6. Độ tương phản chữ đạt AA không? Focus bàn phím có nhìn thấy không?
Liệt kê những gì đã sửa trong tối đa 6 gạch đầu dòng.
```

---

## Prompt từng màn
Mỗi prompt có 3 phần: **nội dung**, **tương tác/trạng thái**, **xong khi**. Chi tiết cột và trường xem `screens.md`.

**S01 Đăng nhập**
```
Nội dung: 2 cột. Trái là nền xanh sổ #1F5C4F, tên "Kho Vật tư y tế", dòng "Bệnh viện quận Phú Nhuận"; phía dưới in mờ một mẫu phiếu lĩnh (chất liệu giấy, không phải ảnh minh họa). Phải là form: Tên đăng nhập, Mật khẩu, Ghi nhớ đăng nhập, nút "Đăng nhập". Dưới form là nhóm "Đăng nhập nhanh để demo" với 4 lựa chọn: ĐD khoa (Nguyễn Thị Lan), Thủ kho (Trần Văn Hùng), Trưởng P.VTTBYT (Lê Thị Kim Hạnh), Kế toán dược (Phạm Minh Tuấn).
Trạng thái: sai mật khẩu hiện dòng "Sai tên đăng nhập hoặc mật khẩu. Kiểm tra lại hoặc liên hệ P.VTTBYT để cấp lại."
Xong khi: không có hero ảnh stock, không gradient; form căn trái, rộng tối đa 360px.
```
**S02 Dashboard (Thủ kho)**
```
Nội dung: đầu trang là "Việc cần làm hôm nay", danh sách phiếu cần xử lý (PL-2026-0012 Khoa Nội 3 mặt hàng, Chờ kho xác nhận; PL-2026-0013 Khoa Xét nghiệm, Chờ duyệt). Việc cần làm là thứ quan trọng nhất nên đặt lên trước, KHÔNG mở đầu bằng hàng thẻ số lớn. Bên phải là cột hẹp "Sắp hết hạn", trông như dãy tem nhãn lô: tên vật tư, số lô, HSD, "còn N ngày" (Que thử đường huyết lô QT2403, HSD 08/10/2026, còn 14 ngày, đỏ). Dưới cùng là một dòng tóm tắt gọn: 5 lô sắp hết hạn, 2 vật tư dưới tồn tối thiểu, 41 phiếu cấp phát tháng 9.
Tương tác: bấm một phiếu thì mở chi tiết; bấm một tem lô thì mở tồn kho đã lọc theo lô đó.
Xong khi: nhìn trong 3 giây biết ngay việc gì phải làm trước; đỏ dấu chỉ xuất hiện ở lô còn dưới 30 ngày.
```
**S03 Danh mục vật tư**
```
Nội dung: tiêu đề "Danh mục vật tư", nút "Thêm vật tư". Thanh lọc gồm: ô tìm theo mã hoặc tên, Nhóm, Điều kiện bảo quản. Bảng phẳng: Mã, Tên VTTHYT, ĐVT, Số ĐK, Nhóm, Bảo quản (nhãn "Phòng 15–25°C / Mát 8–15°C / Lạnh 2–8°C"), Đơn giá, Tồn, Tồn tối thiểu.
Tương tác: bấm dòng thì mở drawer bên phải để sửa; tồn dưới mức tối thiểu hiện chữ hổ phách kèm "dưới mức tối thiểu".
Trạng thái rỗng: "Không tìm thấy vật tư khớp 'găng tay L'. Kiểm tra chính tả hoặc Thêm vật tư."
Xong khi: bảng không bị bọc trong card; số căn phải.
```
**S04 Tồn kho theo lô**
```
Nội dung: chọn kho (Kho chính / Tủ trực Khoa Nội). Bảng nhóm theo vật tư; dòng vật tư in đậm có tổng tồn, các dòng lô thụt vào: Số lô, Vị trí, HSD, Còn (ngày), SL. Lô biệt trữ (KL2208) có con dấu nhỏ "Biệt trữ" và bị gạch khỏi tổng khả dụng.
Tương tác: sắp xếp theo HSD; mở rộng/thu gọn từng nhóm vật tư.
Xong khi: người xem nhận ra ngay lô nào phải xuất trước; màu hạn dùng luôn có chữ đi kèm.
```
**S05 Lập phiếu lĩnh**
```
Nội dung: bố cục mô phỏng "Phiếu lĩnh vật dụng y tế tiêu hao" trên giấy: phần đầu phiếu có Khoa Nội, Kho lĩnh, Ngày, Lý do/Y lệnh. Bảng dòng: STT, Tên VTTHYT (ô tìm có gợi ý), Mã, ĐVT, Tồn khả dụng (chỉ đọc, chữ phụ), SL yêu cầu, nút xóa dòng. Phía trên là thanh tiến trình 5 bước thật của quy trình (Lập phiếu, Trưởng khoa duyệt, Kho xác nhận, Trưởng P.VTTBYT duyệt, Cấp phát), đây là một trình tự thật nên được đánh số.
Tương tác: "Thêm dòng", "Lưu nháp", "Gửi duyệt". SL vượt tồn thì dưới ô hiện "Vượt tồn khả dụng 20 cái. Kho sẽ báo lại số có thể cấp."
Xong khi: nhìn giống bản số hóa của mẫu giấy, không giống form SaaS.
```
**S06 Danh sách phiếu lĩnh**
```
Nội dung: tab kèm số lượng: Tất cả 24, Chờ kho xác nhận 3, Chờ duyệt 2, Đã duyệt 1, Đã cấp phát 17, Từ chối 1. Bảng: Số phiếu, Ngày, Khoa, Số mặt hàng, Người lập, Trạng thái (badge phẳng, KHÔNG dùng con dấu ở danh sách).
Trạng thái rỗng theo tab: "Không có phiếu nào đang chờ duyệt."
Xong khi: badge đủ tương phản; tab đang chọn rõ ràng mà không cần gạch chân dày.
```
**S07 Chi tiết và duyệt phiếu lĩnh**
```
Nội dung: đây là màn đặt điểm nhấn. Phiếu PL-2026-0012 hiển thị như một tờ chứng từ: phần đầu, bảng vật tư (SL yêu cầu, Tồn kho, SL phát). Góc trên phải tờ phiếu có con dấu mực đỏ nghiêng khoảng 4° ghi trạng thái hiện tại, kèm tên người và ngày. Cột phải là dòng thời gian duyệt 5 bước, mỗi bước ghi người, giờ và ngày.
Tương tác: Thủ kho có "Trả lại khoa sửa" và "Xác nhận"; Trưởng P.VTTBYT có "Từ chối" và "Duyệt". "Từ chối" mở modal bắt buộc nhập lý do. Khi bấm Duyệt, con dấu "đóng" xuống trong 180ms; nếu người dùng bật giảm chuyển động thì chỉ đổi trạng thái, không có hiệu ứng.
Xong khi: con dấu là thứ duy nhất có màu đỏ trên màn; còn lại trung tính.
```
**S08 Cấp phát**
```
Nội dung: phiếu đã duyệt. Mỗi vật tư hiện các lô hệ thống chọn theo nguyên tắc hết hạn trước (ghi rõ "Hết hạn trước, xuất trước" ở lô đầu tiên): Lô, HSD, SL lấy; một vật tư có thể tách thành nhiều lô. Thiếu hàng thì hiện "Thiếu 5 hộp. Cấp số hiện có và báo khoa phần còn lại."
Tương tác: sửa tay số lượng từng lô; nút "Cấp phát" trừ tồn rồi mở chứng từ xuất.
Xong khi: người xem hiểu tại sao hệ thống chọn lô đó mà không cần giải thích thêm.
```
**S09 Chứng từ xuất kho (A4)**
```
Nội dung: trang A4 dùng Noto Serif, trắng đen. Góc trái: "Sở Y tế TP. Hồ Chí Minh / Bệnh viện quận Phú Nhuận / Phòng Vật tư – TBYT"; góc phải: Số CTX. Tiêu đề "CHỨNG TỪ XUẤT KHO", dòng ngày. Hình thức xuất, Kho xuất, Phòng nhận. Bảng kẻ đủ viền: STT, Mã hàng, Tên hàng và số lô, ĐVT, SL, Đơn giá, Thành tiền, dòng Tổng cộng. 3 cột ký: Người phát, Người lĩnh, P.VTTBYT, mỗi cột có "(Ký, ghi rõ họ tên)".
Xong khi: in ra trông như văn bản hành chính thật, không có màu thương hiệu.
```
**S10 Kiểm nhập và phiếu nhập kho**
```
Nội dung: phần đầu gồm Nhà cung cấp (Công ty TNHH TBYT Minh Phát), Hợp đồng/Gói thầu, Số hóa đơn, Ngày nhận. Bảng: Vật tư (kèm số ĐK và điều kiện bảo quản), Số lô, HSD, SL, Đơn giá hợp đồng, Đơn giá hóa đơn (sửa được), Kết quả (Đạt / Không đạt). Thanh tiến trình 5 bước nhập kho.
Tương tác: đơn giá lệch hợp đồng thì ô viền đỏ dấu, bên dưới ghi "Lệch 15.000 ₫ so với hợp đồng", và nút "Nhập kho" bị khóa kèm lý do. Dòng Không đạt hiện con dấu nhỏ "Biệt trữ".
Xong khi: lý do bị chặn luôn nằm ngay cạnh chỗ cần sửa.
```
**S11 Báo cáo xuất – nhập – tồn**
```
Nội dung: bộ lọc Tháng 09/2026 và Kho chính; nút "Xuất Excel". Bảng: Mã, Tên, ĐVT, Tồn đầu, Nhập, Xuất, Tồn cuối, Giá trị tồn; dòng tổng in đậm, có đường kẻ đôi phía trên như sổ kế toán.
Xong khi: đọc giống một trang sổ kho; mọi cột số căn phải và thẳng hàng.
```
**S12 Dự trù tháng**
```
Nội dung: "Dự trù tháng 10/2026". Nếu ngoài ngày 1–5 thì hiện dòng thông báo: "Hôm nay ngoài kỳ dự trù định kỳ (ngày 1–5). Dự trù này sẽ được ghi là đột xuất." Bảng: Tên, ĐVT, Tồn đầu, Nhập, Xuất, Tồn cuối, TB xuất 3 tháng, SL gợi ý (nền xanh sổ nhạt, có chú thích công thức "TB xuất × 1,2 − tồn cuối"), SL dự trù (sửa được), HSD gần nhất.
Tương tác: "Gửi duyệt"; ô SL dự trù khác gợi ý hơn 50% thì hiện gợi ý ghi chú lý do.
Xong khi: người lập thấy vì sao hệ thống gợi ý con số đó.
```
