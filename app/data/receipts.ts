import type { Receipt } from '~/types'
import { HOP_DONG, NCC } from './catalog'

/**
 * Goods receipts. In progress: PN-0041 being inspected by the kho (one price above the
 * contract, one line failed), PN-0040 waiting for the accountant, PN-0039 waiting for
 * the P.VTTBYT signature. The rest are closed and explain the September lots.
 */
export function seedReceipts(): Receipt[] {
  return [
    {
      so: 'PN-2026-0041', ncc: NCC.phuongnam, hd: HOP_DONG, hoaDon: 'HĐ GTGT 0001842', at: '2026-09-30T08:30', by: 'hung', stage: 0,
      lines: [
        { ma: 'VT002', so: 'GT2409', hsd: '2027-09-15', sl: 50, gia: 68000, giaHd: 68000, dat: true },
        { ma: 'VT007', so: 'KT2409', hsd: '2028-09-01', sl: 60, gia: 45000, giaHd: 45000, dat: true },
        { ma: 'VT004', so: 'KL2409', hsd: '2027-08-20', sl: 200, gia: 10200, giaHd: 9800, dat: true },
        { ma: 'VT009', so: 'BK2409', hsd: '2027-09-30', sl: 48, gia: 8900, giaHd: 8900, dat: false, ghiChu: 'Thùng móp, 4 hộp bị ẩm' }
      ],
      events: [{ at: '2026-09-30T08:30', by: 'hung', kind: 'nhan', note: 'Nhận 4 kiện, đủ số lượng theo hóa đơn' }]
    },
    {
      so: 'PN-2026-0040', ncc: NCC.namviet, hd: HOP_DONG, hoaDon: 'HĐ GTGT 0007315', at: '2026-09-29T09:10', by: 'hung', stage: 1,
      lines: [
        { ma: 'HC001', so: 'HC2409', hsd: '2027-08-31', sl: 6, gia: 1350000, giaHd: 1350000, dat: true },
        { ma: 'VT006', so: 'QT2409', hsd: '2027-09-10', sl: 20, gia: 210000, giaHd: 210000, dat: true }
      ],
      events: [
        { at: '2026-09-29T09:10', by: 'hung', kind: 'nhan' },
        { at: '2026-09-29T10:25', by: 'hung', kind: 'kiem-nhap', note: 'Hội đồng kiểm nhập đã ký sổ. Hóa chất bảo quản lạnh đúng 2–8 °C khi nhận.' }
      ]
    },
    {
      so: 'PN-2026-0039', ncc: NCC.saigon, hd: HOP_DONG, hoaDon: 'HĐ GTGT 0012077', at: '2026-09-28T14:00', by: 'hung', stage: 2,
      lines: [
        { ma: 'VT003', so: 'BG2409', hsd: '2028-03-31', sl: 20, gia: 145000, giaHd: 145000, dat: true },
        { ma: 'VT008', so: 'GC2409', hsd: '2029-09-01', sl: 300, gia: 12500, giaHd: 12500, dat: true }
      ],
      events: [
        { at: '2026-09-28T14:00', by: 'hung', kind: 'nhan' },
        { at: '2026-09-28T15:10', by: 'hung', kind: 'kiem-nhap' },
        { at: '2026-09-29T10:40', by: 'tuan', kind: 'ke-toan', note: 'Hóa đơn khớp hợp đồng. Đã lập phiếu nhập kho.' }
      ]
    },
    closed('PN-2026-0038', NCC.namviet, '2026-09-15T09:00', [{ ma: 'VT010', so: 'ON2409', hsd: '2027-09-01', sl: 2000, gia: 1450, giaHd: 1450, dat: true }]),
    closed('PN-2026-0037', NCC.saigon, '2026-09-04T08:40', [
      { ma: 'VT001', so: 'BT2409', hsd: '2027-08-15', sl: 2000, gia: 1150, giaHd: 1150, dat: true },
      { ma: 'VT005', so: 'DT2412', hsd: '2027-10-18', sl: 800, gia: 5200, giaHd: 5200, dat: true }
    ]),
    closed('PN-2026-0036', NCC.saigon, '2026-08-20T10:15', [{ ma: 'HC002', so: 'CN2408', hsd: '2028-08-01', sl: 200, gia: 32000, giaHd: 32000, dat: true }]),
    closed('PN-2026-0035', NCC.phuongnam, '2026-08-11T09:30', [{ ma: 'VT007', so: 'KT2407', hsd: '2028-07-01', sl: 300, gia: 45000, giaHd: 45000, dat: true }]),
    closed('PN-2026-0034', NCC.namviet, '2026-07-08T08:50', [{ ma: 'VT010', so: 'ON2406', hsd: '2027-06-15', sl: 5000, gia: 1450, giaHd: 1450, dat: true }])
  ]
}

function closed(so: string, ncc: string, at: string, lines: Receipt['lines']): Receipt {
  const day = at.slice(0, 10)
  return {
    so, ncc, hd: HOP_DONG, hoaDon: `HĐ GTGT 00${so.slice(-4)}`, at, by: 'hung', stage: 3, lines,
    events: [
      { at, by: 'hung', kind: 'nhan' },
      { at: `${day}T11:00`, by: 'hung', kind: 'kiem-nhap' },
      { at: `${day}T14:30`, by: 'tuan', kind: 'ke-toan' },
      { at: `${day}T16:00`, by: 'hanh', kind: 'ky' },
      { at: `${day}T16:05`, by: 'hung', kind: 'nhap-kho' }
    ]
  }
}
