import type { Lo, Person, PersonKey, Phieu, PhieuStatus, VatTu } from '~/types'
import { days, pad, pd } from '~/utils/format'

export const VT: VatTu[] = [
  { ma: 'VT001', ten: 'Bơm tiêm 5ml', dvt: 'Cái', nhom: 'Tiêm truyền', bq: 'Phòng', gia: 1150, tonMin: 500 },
  { ma: 'VT002', ten: 'Găng tay khám size M', dvt: 'Hộp', nhom: 'Bảo hộ', bq: 'Phòng', gia: 68000, tonMin: 40 },
  { ma: 'VT003', ten: 'Bông y tế 1kg', dvt: 'Gói', nhom: 'Băng gạc', bq: 'Phòng', gia: 145000, tonMin: 10 },
  { ma: 'VT004', ten: 'Kim luồn tĩnh mạch 22G', dvt: 'Cái', nhom: 'Tiêm truyền', bq: 'Phòng', gia: 9800, tonMin: 200 },
  { ma: 'VT005', ten: 'Dây truyền dịch', dvt: 'Bộ', nhom: 'Tiêm truyền', bq: 'Phòng', gia: 5200, tonMin: 300 },
  { ma: 'VT006', ten: 'Que thử đường huyết', dvt: 'Hộp', nhom: 'Xét nghiệm', bq: 'Mát', gia: 210000, tonMin: 15 },
  { ma: 'HC001', ten: 'Hóa chất xét nghiệm Glucose', dvt: 'Lọ', nhom: 'Hóa chất', bq: 'Lạnh', gia: 1350000, tonMin: 4 }
]

export const LOC: Record<string, string> = {
  VT001: 'A1-02', VT002: 'A2-01', VT003: 'A3-04', VT004: 'B1-03', VT005: 'B2-01', VT006: 'C1-02', HC001: 'L1-01'
}

export const LO: Lo[] = [
  { ma: 'VT001', so: 'BT2402', hsd: '2026-11-20', sl: 800 }, { ma: 'VT001', so: 'BT2409', hsd: '2027-08-15', sl: 1500 },
  { ma: 'VT002', so: 'GT2310', hsd: '2026-10-12', sl: 25 }, { ma: 'VT002', so: 'GT2405', hsd: '2027-05-01', sl: 60 },
  { ma: 'VT003', so: 'BG2401', hsd: '2027-01-30', sl: 18 },
  { ma: 'VT004', so: 'KL2311', hsd: '2026-12-05', sl: 150 }, { ma: 'VT004', so: 'KL2401', hsd: '2027-03-10', sl: 40, q: true },
  { ma: 'VT005', so: 'DT2406', hsd: '2027-06-30', sl: 420 }, { ma: 'VT005', so: 'DT2412', hsd: '2027-10-18', sl: 600 },
  { ma: 'VT006', so: 'QT2403', hsd: '2026-10-08', sl: 12 }, { ma: 'HC001', so: 'HC2405', hsd: '2027-02-28', sl: 6 }
]

export const vt = (m: string) => VT.find(v => v.ma === m)

export const KHOA = ['Khoa Nội', 'Khoa Cấp cứu', 'Khoa Ngoại', 'Khoa Xét nghiệm', 'Khoa Nhi', 'Khoa Sản']

export const P: Record<PersonKey, Person> = {
  lan: { n: 'Nguyễn Thị Lan', r: 'ĐD khoa', i: 'NL', c: '#8FA3BF' },
  binh: { n: 'Võ Thanh Bình', r: 'Trưởng khoa', i: 'VB', c: '#B59A7A' },
  hung: { n: 'Trần Văn Hùng', r: 'Thủ kho', i: 'TH', c: '#7FA895' },
  hanh: { n: 'Lê Thị Kim Hạnh', r: 'Trưởng P.VTTBYT', i: 'LH', c: '#A592BF' },
  tuan: { n: 'Phạm Minh Tuấn', r: 'Kế toán dược', i: 'PT', c: '#C08E8A' }
}

export const STEPS = ['Lập phiếu', 'Trưởng khoa duyệt', 'Kho xác nhận', 'Trưởng P.VTTBYT duyệt', 'Cấp phát']
export const STEP_P: PersonKey[] = ['lan', 'binh', 'hung', 'hanh', 'hung']
export const ST: Record<PhieuStatus, string> = { W: 'Chờ duyệt', A: 'Đã duyệt', D: 'Đã cấp phát', R: 'Từ chối', N: 'Nháp' }

const overrides: Record<number, PhieuStatus> = {
  128: 'W', 127: 'A', 126: 'W', 125: 'W', 124: 'A', 123: 'A', 122: 'N', 121: 'W', 120: 'A', 119: 'W', 118: 'A',
  117: 'R', 116: 'N', 110: 'R', 98: 'R', 87: 'R', 61: 'R', 44: 'N'
}

export function buildSlips(): Phieu[] {
  const out: Phieu[] = []
  for (let n = 128; n >= 1; n--) {
    const s = (n * 7919) % 97
    const st = overrides[n] || 'D'
    const dd = new Date(2026, 8, 30 - Math.floor((128 - n) * 0.98 + ((128 - n) > 40 ? (128 - n) * 0.4 : 0)))
    const cnt = 2 + (s % 4)
    const items: Phieu['items'] = []
    for (let k = 0; k < cnt; k++) {
      const v = VT[(s + k * 3) % VT.length]!
      const req = v.gia > 100000 ? 2 + ((s + k) % 5) : [100, 200, 50, 300, 20][(s + k) % 5]!
      const lots = LO.filter(l => l.ma === v.ma && !l.q && days(pd(l.hsd)) > 0).sort((a, b) => a.hsd < b.hsd ? -1 : 1)
      items.push({ v, req, lot: lots[0] })
    }
    const khoa = KHOA[(s + n) % KHOA.length]!
    out.push({
      n, no: 'PL-2026-' + pad(n).padStart(4, '0'), khoa, date: dd, st, items,
      value: items.reduce((a, i) => a + i.req * i.v.gia, 0), hh: 9 + (s % 8), mm: (s * 7) % 60,
      lan: khoa === 'Khoa Xét nghiệm' ? 'tuan' : 'lan'
    })
  }
  return out
}
