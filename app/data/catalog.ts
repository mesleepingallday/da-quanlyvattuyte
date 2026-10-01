import type { Item, Lot, Storage } from '~/types'

export const KHO_CHINH = 'Kho chính'

export const NCC = {
  saigon: 'Công ty CP Dược – Vật tư Y tế Sài Gòn',
  phuongnam: 'Công ty TNHH Thiết bị Y tế Phương Nam',
  namviet: 'Công ty CP Hóa chất và Sinh phẩm Nam Việt'
} as const

export const HOP_DONG = 'HĐ 12/2026/BVPN – Gói thầu VTTH năm 2026'

export const STORAGE: Record<Storage, { label: string, range: string, icon: string }> = {
  phong: { label: 'Nhiệt độ phòng', range: '15–25 °C', icon: 'i-lucide-thermometer' },
  mat: { label: 'Bảo quản mát', range: '8–15 °C', icon: 'i-lucide-wind' },
  lanh: { label: 'Bảo quản lạnh', range: '2–8 °C', icon: 'i-lucide-snowflake' }
}

export const NHOM_ICON: Record<string, string> = {
  'Tiêm truyền': 'i-lucide-syringe',
  'Bảo hộ': 'i-lucide-shield-check',
  'Băng gạc': 'i-lucide-layers-2',
  'Xét nghiệm': 'i-lucide-test-tubes',
  'Hóa chất': 'i-lucide-flask-conical'
}

export const ITEMS: Item[] = [
  { ma: 'VT001', ten: 'Bơm tiêm 5 ml', dvt: 'Cái', nhom: 'Tiêm truyền', bq: 'phong', gia: 1150, tonMin: 500, soDk: '2300417/PCBB-HCM', bhyt: true, img: 'bom-tiem-5ml', viTri: 'A1-02', quyCach: 'Hộp 100 cái', dungTB: 1800 },
  { ma: 'VT002', ten: 'Găng tay khám size M', dvt: 'Hộp', nhom: 'Bảo hộ', bq: 'phong', gia: 68000, tonMin: 40, soDk: '2200958/PCBA-HCM', bhyt: true, img: 'gang-tay-kham', viTri: 'A2-01', quyCach: 'Hộp 100 chiếc', dungTB: 95 },
  { ma: 'VT003', ten: 'Bông y tế 1 kg', dvt: 'Gói', nhom: 'Băng gạc', bq: 'phong', gia: 145000, tonMin: 10, soDk: '2100332/PCBA-HN', bhyt: true, img: 'bong-y-te', viTri: 'A3-04', quyCach: 'Gói 1 kg', dungTB: 14 },
  { ma: 'VT004', ten: 'Kim luồn tĩnh mạch 22G', dvt: 'Cái', nhom: 'Tiêm truyền', bq: 'phong', gia: 9800, tonMin: 200, soDk: '2301126/PCBB-HCM', bhyt: true, img: 'kim-luon-22g', viTri: 'B1-03', quyCach: 'Hộp 50 cái', dungTB: 420 },
  { ma: 'VT005', ten: 'Dây truyền dịch', dvt: 'Bộ', nhom: 'Tiêm truyền', bq: 'phong', gia: 5200, tonMin: 300, soDk: '2200741/PCBB-HCM', bhyt: true, img: 'day-truyen-dich', viTri: 'B2-01', quyCach: 'Thùng 200 bộ', dungTB: 650 },
  { ma: 'VT006', ten: 'Que thử đường huyết', dvt: 'Hộp', nhom: 'Xét nghiệm', bq: 'mat', gia: 210000, tonMin: 15, soDk: '2300085/PCBB-HN', bhyt: true, img: 'que-thu-duong-huyet', viTri: 'C1-02', quyCach: 'Hộp 50 que', dungTB: 22 },
  { ma: 'VT007', ten: 'Khẩu trang y tế 4 lớp', dvt: 'Hộp', nhom: 'Bảo hộ', bq: 'phong', gia: 45000, tonMin: 60, soDk: '2100519/PCBA-HCM', bhyt: true, img: 'khau-trang', viTri: 'A2-03', quyCach: 'Hộp 50 cái', dungTB: 120 },
  { ma: 'VT008', ten: 'Gạc phẫu thuật 10 × 10 cm', dvt: 'Gói', nhom: 'Băng gạc', bq: 'phong', gia: 12500, tonMin: 150, soDk: '2200260/PCBA-HCM', bhyt: true, img: 'gac-10x10', viTri: 'A3-01', quyCach: 'Gói 10 miếng, vô trùng', dungTB: 380 },
  { ma: 'VT009', ten: 'Băng keo lụa 2,5 cm', dvt: 'Cuộn', nhom: 'Băng gạc', bq: 'phong', gia: 8900, tonMin: 100, soDk: '2100877/PCBA-HCM', bhyt: true, img: 'bang-keo-lua', viTri: 'A3-06', quyCach: 'Hộp 12 cuộn', dungTB: 210 },
  { ma: 'VT010', ten: 'Ống nghiệm EDTA 2 ml', dvt: 'Ống', nhom: 'Xét nghiệm', bq: 'phong', gia: 1450, tonMin: 1000, soDk: '2300640/PCBB-HCM', bhyt: true, img: 'ong-nghiem-edta', viTri: 'C2-04', quyCach: 'Khay 100 ống', dungTB: 2600 },
  { ma: 'HC001', ten: 'Hóa chất xét nghiệm Glucose', dvt: 'Lọ', nhom: 'Hóa chất', bq: 'lanh', gia: 1350000, tonMin: 4, soDk: '2300219/PCBB-HCM', bhyt: true, img: 'hoa-chat-glucose', viTri: 'Tủ lạnh L1-01', quyCach: 'Lọ 100 ml', dungTB: 5 },
  { ma: 'HC002', ten: 'Cồn 70° 500 ml', dvt: 'Chai', nhom: 'Hóa chất', bq: 'phong', gia: 32000, tonMin: 40, soDk: '2200118/PCBA-HCM', bhyt: false, img: 'con-70', viTri: 'D1-02', quyCach: 'Thùng 20 chai', dungTB: 90 }
]

/** Lots in stock on 30/09/2026. Each attention state appears once: expired, < 30 days, < 90 days, below minimum, quarantined. */
export const LOTS: Lot[] = [
  { ma: 'VT001', so: 'BT2402', hsd: '2026-11-20', sl: 800, viTri: 'A1-02', ncc: NCC.saigon, ngayNhap: '2026-03-12' },
  { ma: 'VT001', so: 'BT2409', hsd: '2027-08-15', sl: 1500, viTri: 'A1-03', ncc: NCC.saigon, ngayNhap: '2026-09-04' },
  { ma: 'VT002', so: 'GT2310', hsd: '2026-10-12', sl: 25, viTri: 'A2-01', ncc: NCC.phuongnam, ngayNhap: '2025-11-02' },
  { ma: 'VT002', so: 'GT2405', hsd: '2027-05-01', sl: 60, viTri: 'A2-02', ncc: NCC.phuongnam, ngayNhap: '2026-06-18' },
  { ma: 'VT003', so: 'BG2401', hsd: '2027-01-30', sl: 18, viTri: 'A3-04', ncc: NCC.saigon, ngayNhap: '2026-02-20' },
  { ma: 'VT004', so: 'KL2311', hsd: '2026-12-05', sl: 150, viTri: 'B1-03', ncc: NCC.phuongnam, ngayNhap: '2025-12-15' },
  { ma: 'VT004', so: 'KL2401', hsd: '2027-03-10', sl: 40, viTri: 'Khu biệt trữ', ncc: NCC.phuongnam, ngayNhap: '2026-04-09', q: true, qLyDo: 'Bao bì rách khi kiểm nhập, chờ nhà cung cấp đổi' },
  { ma: 'VT005', so: 'DT2406', hsd: '2027-06-30', sl: 420, viTri: 'B2-01', ncc: NCC.saigon, ngayNhap: '2026-07-01' },
  { ma: 'VT005', so: 'DT2412', hsd: '2027-10-18', sl: 600, viTri: 'B2-02', ncc: NCC.saigon, ngayNhap: '2026-09-04' },
  { ma: 'VT006', so: 'QT2403', hsd: '2026-10-08', sl: 12, viTri: 'C1-02', ncc: NCC.namviet, ngayNhap: '2026-04-02' },
  { ma: 'VT007', so: 'KT2407', hsd: '2028-07-01', sl: 140, viTri: 'A2-03', ncc: NCC.phuongnam, ngayNhap: '2026-08-11' },
  { ma: 'VT008', so: 'GC2405', hsd: '2029-05-01', sl: 520, viTri: 'A3-01', ncc: NCC.saigon, ngayNhap: '2026-06-03' },
  { ma: 'VT009', so: 'BK2311', hsd: '2027-02-15', sl: 240, viTri: 'A3-06', ncc: NCC.saigon, ngayNhap: '2026-01-20' },
  { ma: 'VT010', so: 'ON2406', hsd: '2027-06-15', sl: 3200, viTri: 'C2-04', ncc: NCC.namviet, ngayNhap: '2026-07-08' },
  { ma: 'VT010', so: 'ON2409', hsd: '2027-09-01', sl: 2000, viTri: 'C2-05', ncc: NCC.namviet, ngayNhap: '2026-09-15' },
  { ma: 'HC001', so: 'HC2405', hsd: '2027-02-28', sl: 6, viTri: 'Tủ lạnh L1-01', ncc: NCC.namviet, ngayNhap: '2026-05-21' },
  { ma: 'HC002', so: 'CN2403', hsd: '2026-09-25', sl: 12, viTri: 'D1-01', ncc: NCC.saigon, ngayNhap: '2025-04-10' },
  { ma: 'HC002', so: 'CN2408', hsd: '2028-08-01', sl: 110, viTri: 'D1-02', ncc: NCC.saigon, ngayNhap: '2026-08-20' }
]

const itemMap = new Map(ITEMS.map(i => [i.ma, i]))
export const item = (ma: string) => itemMap.get(ma)!

export const imgSrc = (it: Pick<Item, 'img'>) => it.img ? `/images/vat-tu/${it.img}.webp` : undefined
