# Lộ trình Đồ án: Hệ thống nhập & cấp phát Vật tư y tế (VTTHYT) – BV quận Phú Nhuận

## Context
Đồ án tốt nghiệp kỹ sư. Nguồn nghiệp vụ: QĐ 651/QĐ-BVPN (05/12/2024) "Quy trình nhập hàng, bảo quản và cấp phát VTYT, hóa chất, VTTH" (PDF scan 14 trang, đã được subagent Sonnet đọc qua ảnh). Repo `da-quanlyvattuyte` hiện trống. Mục tiêu: web app số hóa quy trình SOP, ra sản phẩm demo được + báo cáo + bảo vệ.

Bài giảng kiểu Brian Yu: làm một lát cắt nhỏ chạy được từ sớm, rồi mở rộng dần; mỗi tuần có một bản demo.

## 1. Tóm tắt nghiệp vụ (đã trích từ tài liệu)
- **Vai trò:** Thủ kho/Phụ kho, Kế toán dược (TCKT), Hội đồng kiểm nhập, Trưởng P.VTTBYT, Trưởng P.TCKT, ĐD/KTV khoa (người lĩnh), Trưởng khoa, Ban Giám đốc, Admin.
- **Nhập kho 7 bước:** Dự trù (ngày 1–5 hàng tháng, cộng đột xuất) → Đặt hàng → Nhận hàng & kiểm tra (tên, ĐVT, số ĐK, SL, giá theo hợp đồng/trúng thầu, lô, HSD; hàng không đạt thì biệt trữ/trả NCC) → Sổ kiểm nhập (có chữ ký hội đồng) → Kế toán kiểm tra hóa đơn, in phiếu nhập → Trưởng TCKT xác nhận, Trưởng VTTBYT ký → Phiếu đề nghị thanh toán.
- **Xuất kho 6 bước:** Khoa lập phiếu lĩnh (Trưởng khoa duyệt) → Thủ kho xác nhận trong ngày (tồn thiếu thì báo khoa) → Trưởng VTTBYT duyệt → Cấp phát, in chứng từ xuất → Giao nhận, ký → Cập nhật xuất-nhập-tồn.
- **Hàng trả lại:** Trưởng VTTBYT đánh giá rồi quyết định nhập lại kho hoặc biệt trữ chờ hủy.
- **Quy tắc:** FEFO/FIFO khi xuất, điều kiện bảo quản (phòng 15–25°C, mát 8–15°C, lạnh 2–8°C, độ ẩm ≤70%), kiểm kê 1 lần/tháng cả kho lẫn tủ trực khoa, chỉ nhập hàng được BHYT thanh toán (trừ hàng thu phí/trọn gói), lưu hồ sơ 1 năm.
- **Biểu mẫu:** Phiếu lĩnh, Chứng từ xuất kho, Báo cáo sử dụng & dự trù tháng (tồn đầu/nhập/xuất/tồn cuối/dự trù/HSD). Chưa có mẫu phiếu nhập, sổ kiểm nhập, đề nghị thanh toán, nên phải tự thiết kế theo TT 107/2017 hoặc mẫu kế toán HCSN.
- **Chỗ chưa rõ, cần hỏi GVHD/khoa Dược:** ngưỡng tồn min/max, quy trình hủy, quy trình kiểm kê chi tiết, có quản lý thầu/hợp đồng hay không.

## 2. Công nghệ (đã chốt: Nuxt + SQLite)
Toàn bộ dự án là một ứng dụng Nuxt full-stack viết bằng TypeScript: một repo, một ngôn ngữ, một lệnh chạy.
- **Framework:** Nuxt 3 (hoặc 4). Giao diện là Vue 3 `<script setup>`; phần API viết bằng server routes của Nitro trong `server/api/*`, nên không cần backend riêng.
- **Giao diện:** Nuxt UI (Tailwind): có sẵn bảng, form, modal, dark mode. Dùng Pinia khi cần state chung; VueUse.
- **CSDL:** SQLite qua `better-sqlite3`, bật chế độ WAL và foreign_keys. Truy vấn bằng **Drizzle ORM**: schema viết bằng TypeScript, có migration qua `drizzle-kit` và giao diện xem dữ liệu Drizzle Studio.
  - Transaction của better-sqlite3 là đồng bộ, rất hợp cho `InventoryService`: trừ tồn và chọn lô theo hạn dùng trong một giao dịch nguyên tử.
  - Lượng dữ liệu của một bệnh viện quận thì SQLite dư sức. Drizzle cho phép chuyển sang Postgres sau này mà ít phải sửa.
- **Xác thực:** `nuxt-auth-utils` (session cookie mã hóa), mật khẩu băm bằng hàm có sẵn của thư viện. Phân quyền theo vai trò qua middleware phía server `requireRole()`, kèm route middleware phía client.
- **Kiểm tra dữ liệu:** Zod, dùng chung schema cho form và API.
- **Xuất file:** ExcelJS (báo cáo xuất-nhập-tồn), trang in HTML + CSS `@media print` cho phiếu lĩnh và chứng từ xuất (đơn giản hơn tạo PDF). Cần PDF thật thì dùng pdfmake.
- **Kiểm thử:** Vitest cho InventoryService (chạy trên SQLite `:memory:`), `@nuxt/test-utils`, Playwright E2E.
- **Triển khai:** Docker với node-server preset, file SQLite nằm trên volume, chạy trên VPS hoặc Fly.io/Railway có ổ đĩa lưu trữ. **Không** dùng Vercel/serverless, vì SQLite cần đĩa bền. Sao lưu bằng `sqlite3 .backup` qua cron, hoặc Litestream.
- **CI:** GitHub Actions chạy lint, typecheck, vitest, build.

### Mở rộng AI chatbot (sau MVP, giai đoạn 9b, khoảng 1–2 tuần)
- Dùng **Claude API** (`@anthropic-ai/sdk`) với tool calling. Endpoint `server/api/chat.post.ts`, trả lời dạng stream.
- **Chatbot không được truy cập thẳng vào SQL.** Nó chỉ được gọi các tool chỉ-đọc, và mỗi tool tái sử dụng service có sẵn, đồng thời kiểm tra quyền của người dùng đang đăng nhập. Ví dụ các tool:
  - `tra_ton_kho(ten|ma)`
  - `vat_tu_sap_het_han(ngay)`
  - `trang_thai_phieu(so_phieu)`
  - `thong_ke_su_dung(khoa, thang)`
  - `goi_y_du_tru(thang)`
- Có thể thêm: nạp văn bản QĐ 651 làm ngữ cảnh để chatbot trả lời câu hỏi về quy trình ("Phiếu lĩnh cần ai duyệt?"). Tài liệu ngắn nên chỉ cần đưa thẳng vào system prompt, dùng prompt caching, không cần RAG.
- Ghi log hội thoại và giới hạn tần suất gọi. Bật tắt bằng biến môi trường `AI_ENABLED`, để MVP chạy bình thường khi không có khóa API.

### Cấu trúc thư mục
```
server/db/schema.ts, server/db/index.ts, server/services/inventory.ts,
server/api/{vat-tu,phieu-linh,phieu-nhap,bao-cao}/..., server/utils/auth.ts,
pages/, components/, composables/, shared/schemas (zod), tests/
```

## 3. Mô hình dữ liệu cốt lõi
`NguoiDung, VaiTro, KhoaPhong, Kho (kho chính + tủ trực khoa), NhaCungCap, HopDong/GoiThau (+ChiTiet: vật tư, đơn giá, SL trúng thầu), VatTu (mã, tên, ĐVT, số ĐK, nhóm, điều kiện bảo quản, BHYT/thu phí), LoVatTu (số lô, HSD), TonKho (kho, lô, SL)`
Chứng từ theo dạng header + chi tiết + trạng thái + lịch sử duyệt:
`DuTru, DonDatHang, PhieuKiemNhap (+ThanhVienHoiDong), PhieuNhapKho, DeNghiThanhToan, PhieuLinh, PhieuXuatKho, PhieuTraLai, PhieuBietTru/Huy, PhieuKiemKe, NhatKyDuyet (ai, khi nào, hành động, ý kiến), AuditLog`.
**Nguyên tắc quan trọng:** tồn kho chỉ thay đổi qua chứng từ đã duyệt, bằng một service giao dịch duy nhất `InventoryService`. Xuất theo FEFO sẽ tự chọn lô.

## 4. Lộ trình thực hiện (khoảng 16 tuần)

| Giai đoạn | Tuần | Việc chính | Sản phẩm bàn giao |
|---|---|---|---|
| 0. Nhận đề tài | 1 | Gặp GVHD, chốt phạm vi và tên đề tài, đọc kỹ QĐ 651 và các văn bản pháp lý (TT 05/2022, NĐ 98/2021), khảo sát phần mềm tương tự | Đề cương, danh sách câu hỏi nghiệp vụ |
| 1. Phân tích | 2–3 | Use case tổng quát và phân rã, đặc tả use case, sơ đồ hoạt động BPMN cho nhập và xuất, state diagram cho mỗi loại phiếu, yêu cầu phi chức năng | Chương 2 báo cáo (bản nháp) |
| 2. Thiết kế | 4–5 | ERD và lược đồ CSDL, kiến trúc (layered/clean), thiết kế API (OpenAPI), ma trận phân quyền, wireframe (Figma) | Chương 3, repo skeleton |
| 3. Nền tảng | 6 | Khởi tạo repo, Docker Compose, CI, nuxt-auth-utils, RBAC, CRUD danh mục (vật tư, NCC, khoa, kho, người dùng) | Demo đăng nhập + danh mục |
| 4. Lát cắt dọc #1: Xuất kho | 7–8 | Phiếu lĩnh → xác nhận → duyệt → cấp phát theo FEFO → in chứng từ xuất | Luồng cấp phát chạy từ đầu đến cuối |
| 5. Nhập kho | 9–10 | Dự trù (gợi ý số lượng từ tiêu hao + tồn), đặt hàng, kiểm nhập (kiểm giá theo hợp đồng), phiếu nhập, duyệt 2 cấp, đề nghị thanh toán | Luồng nhập đầy đủ |
| 6. Nghiệp vụ phụ | 11 | Trả lại/biệt trữ/hủy, kiểm kê tháng (kho + tủ khoa), điều chỉnh chênh lệch | |
| 7. Báo cáo & cảnh báo | 12 | Báo cáo xuất-nhập-tồn, báo cáo sử dụng & dự trù theo mẫu, dashboard, cảnh báo sắp hết hạn/tồn thấp, xuất Excel/PDF | |
| 8. Kiểm thử | 13 | Unit test InventoryService (FEFO, không âm kho, đồng thời), integration test API, E2E Playwright cho 2 luồng chính, dữ liệu seed thực tế | Bảng test case, chương 4 |
| 9. Triển khai (+9b AI chatbot tùy chọn) | 14 | Deploy (VPS/Render + Docker), HTTPS, sao lưu DB, tài liệu hướng dẫn sử dụng | URL demo |
| 10. Báo cáo & bảo vệ | 15–16 | Hoàn thiện quyển báo cáo, slide, kịch bản demo 10 phút, tập trả lời câu hỏi phản biện | Quyển đồ án + slide |

**Điểm có thể làm thêm để nổi bật (sau khi MVP xong):** quét mã vạch/QR lô hàng, thông báo realtime khi có phiếu chờ duyệt, dự báo dự trù bằng trung bình trượt, chữ ký số/ký duyệt điện tử, nhật ký audit.

## 5. Cấu trúc quyển báo cáo
1. Tổng quan (bối cảnh, lý do, mục tiêu, phạm vi)
2. Cơ sở lý thuyết & công nghệ
3. Phân tích yêu cầu
4. Thiết kế hệ thống
5. Cài đặt & kiểm thử
6. Kết luận & hướng phát triển
Phụ lục: biểu mẫu, test case.

## 6. Cách kiểm chứng
- Mỗi giai đoạn kết thúc bằng một buổi demo cho GVHD.
- CI xanh.
- Kịch bản E2E: khoa lập phiếu lĩnh 3 vật tư → kho xác nhận → trưởng phòng duyệt → xuất đúng lô HSD gần nhất → tồn kho giảm đúng → báo cáo X-N-T khớp.
- Kịch bản nhập: giá lệch hợp đồng thì bị chặn, hàng không đạt thì vào biệt trữ.

