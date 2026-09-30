# Nghiên cứu UX/UI ngành y tế – healthtech (đầu vào cho redesign v2)

Tổng hợp từ bài viết chuyên sâu, blog, case study và design system công khai. Mục tiêu: xây "gu" thiết kế đúng với phần mềm y tế vận hành thật, không phải concept art trên Dribbble.

## 10 kết luận và quy tắc rút ra

| # | Kết luận | Quy tắc cho VTYT Kho |
|---|---|---|
| 1 | Ảnh giao diện y tế trên mạng phần lớn là concept art; phần mềm thật bị giấu sau demo. Người dùng lâm sàng là người vận hành hằng ngày, thích **mật độ** hơn vẻ thanh lịch. | Không hero KPI card lớn, không biểu đồ trang trí. Màn đầu tiên trả lời "tôi phải làm gì bây giờ". |
| 2 | **Alert fatigue** là vấn đề an toàn: giao diện gắn cờ mọi thứ dạy người dùng bỏ qua cờ. | 3 tầng: **Nghiêm trọng** (lô hết hạn, giá lệch hợp đồng) chặn thao tác và phải xác nhận; **Cảnh báo** (HSD < 30 ngày, dưới tồn tối thiểu); **Thông tin** ở làn thông báo riêng. Giới hạn số phần tử đỏ mỗi màn. |
| 3 | Không dùng màu làm tín hiệu duy nhất. | Mỗi trạng thái = màu + icon/hình + chữ. Đọc được khi in đen trắng và với người mù màu. WCAG AA. |
| 4 | Progressive disclosure. | Chỉ số quan trọng hiện ngay; chi tiết cách 1 thao tác (drawer, mở dòng), không nhảy trang. |
| 5 | Bảng dữ liệu doanh nghiệp chính là sản phẩm. | Header dính, số tabular căn phải, ẩn/hiện cột, bộ lọc lưu được, thao tác hàng loạt, chế độ mật độ (thoáng/gọn), điều hướng bàn phím. |
| 6 | Quy trình vật tư lấy quét mã làm đầu: mã GS1/UDI chứa lô và HSD; FEFO phải thấy lý do; truy vết lô phục vụ thu hồi. | Ô quét luôn sẵn (Enter để ghi), hiển thị "Hết hạn trước, xuất trước", truy vết lô đến khoa nhận. |
| 7 | Công thái học kho và tablet. | Màn thủ kho: vùng chạm ≥ 44px, tương phản cao, "quét → xác nhận trong vài giây". |
| 8 | Nguyên tắc NHS: thiết kế theo bối cảnh, làm phần khó để người dùng thấy đơn giản, thiết kế cho sự tin cậy. | Nhật ký duyệt (audit trail) trên mọi phiếu; ai, lúc nào, làm gì. |
| 9 | Chữ tiếng Việt cần font thiết kế dấu chuẩn. | Be Vietnam Pro hoặc IBM Plex Sans (có subset VN); thử dấu chồng (ễ, ặ, ở) ở 12px. |
| 10 | Nhà tuyển dụng healthtech tìm: vấn đề, nghiên cứu, ràng buộc (quy định, an toàn), quyết định kèm lý do, trước/sau, kết quả đo được, bản build chạy được. | Case study (docs/case-study) theo đúng cấu trúc này. |

## Nên / không nên

**Nên:** bảng phẳng dày thông tin; một màu nhấn duy nhất; trạng thái có chữ; số căn phải; lỗi nói rõ cách sửa; màn trống mời hành động; chặn sai ngay cạnh ô cần sửa.

**Không nên:** gradient, emoji, card giống hệt nhau với cùng bóng đổ, biểu đồ tròn trang trí, đỏ rải khắp nơi, animation từng khối khi tải, teal chung chung, nhãn VIẾT HOA giãn chữ.

## Nguồn
- [Aufait UX – Healthcare dashboard best practices](https://www.aufaitux.com/blog/healthcare-dashboard-ui-ux-design-best-practices/)
- [Fuselab – Healthcare dashboard design](https://fuselabcreative.com/healthcare-dashboard-design-best-practices/), [Healthcare app UX](https://fuselabcreative.com/healthcare-app-ui-ux-design-best-practices/)
- [Momentum – Healthcare app design system patterns](https://www.themomentum.ai/blog/healthcare-app-design-ui-patterns-design-systems)
- [Lifelinkr – Clinic dashboards doctors can read quickly](https://www.lifelinkr.com/?p=31355)
- [UX Planet – Medical data dashboards benchmarking](https://uxplanet.org/designing-medical-data-dashboards-ux-patterns-benchmarking-f83426ed6c07)
- [Halo Lab – Alert fatigue in healthcare software](https://www.halo-lab.com/blog/alert-fatigue-in-healthcare)
- [NHS service manual – Design principles](https://service-manual.nhs.uk/design-system/design-principles)
- [Pencil & Paper – Enterprise data tables](https://www.pencilandpaper.io/articles/ux-pattern-analysis-enterprise-data-tables)
- [Cleverence – Tablet warehouse UI](https://www.cleverence.com/articles/wms-warehouse-apps/10-warehouse-apps-with-simple-tablet-ui-6384), [Healthcare supply inventory](https://www.cleverence.com/articles/for-business/healthcare-supply-inventory-5931/)
- [eTurns – Medical supply inventory practices](https://www.eturns.com/resources/blog/inventory-medical-supplies/)
- [Designli – AskIris supply case study](https://origin.designli.co/stories/askiris-healthcare-app)
- [Fontsource – Be Vietnam Pro](https://fontsource.org/fonts/be-vietnam-pro/about), [Vietnamese Typography](https://vietnamesetypography.com/advising/)
