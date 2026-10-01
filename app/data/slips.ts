import type { Slip, SlipEvent, SlipLine, Stage } from '~/types'
import { KHO_CHINH, LOTS } from './catalog'
import { KHOA, PEOPLE, headOf } from './people'
import { pad, toDate, toIso } from '~/utils/format'

const so = (n: number) => `PL-2026-${pad(n).padStart(4, '0')}`
const ev = (kind: SlipEvent['kind'], by: string, at: string, note?: string): SlipEvent => ({ at, by, kind, ...(note ? { note } : {}) })
const L = (ma: string, sl: number): SlipLine => ({ ma, sl })

/** First issuable lot by expiry: what FEFO would have picked */
function fefoPicks(lines: SlipLine[]): SlipLine[] {
  return lines.map((l) => {
    const lot = LOTS.filter(x => x.ma === l.ma && !x.q).sort((a, b) => a.hsd.localeCompare(b.hsd))[0]
    return { ...l, picks: [{ so: lot?.so ?? '—', sl: l.sl }] }
  })
}

/**
 * Hand-written recent slips (23–30/09). Each demo role has a realistic queue:
 * Bình (Trưởng khoa Nội) 2 to approve, Hùng (kho) 2 to confirm and 3 to issue,
 * Hạnh (P.VTTBYT) 2 to approve, Lan (ĐD Nội) a rejected slip to fix and a draft.
 */
const RECENT: Slip[] = [
  {
    so: so(128), n: 128, khoa: 'Khoa Xét nghiệm', kho: KHO_CHINH, by: 'tram', at: '2026-09-30T08:52', stage: 2,
    note: 'Bổ sung cho ca xét nghiệm buổi chiều',
    lines: [L('VT010', 500), L('VT006', 4), L('HC001', 2)],
    events: [ev('gui', 'tram', '2026-09-30T08:52'), ev('duyet-khoa', 'thu', '2026-09-30T09:31')]
  },
  {
    so: so(127), n: 127, khoa: 'Khoa Nội', kho: KHO_CHINH, by: 'lan', at: '2026-09-30T08:15', stage: 1,
    note: 'Cơ số tủ trực tuần 40',
    lines: [L('VT001', 200), L('VT004', 50), L('VT005', 60)],
    events: [ev('gui', 'lan', '2026-09-30T08:15')]
  },
  {
    so: so(126), n: 126, khoa: 'Khoa Cấp cứu', kho: KHO_CHINH, by: 'ha', at: '2026-09-30T07:40', stage: 2,
    note: 'Tăng cường cơ số trực cấp cứu cuối tuần',
    lines: [L('VT002', 30), L('VT008', 40), L('VT009', 24), L('VT004', 40)],
    events: [ev('gui', 'ha', '2026-09-30T07:40'), ev('duyet-khoa', 'phuc', '2026-09-30T08:22')]
  },
  {
    so: so(125), n: 125, khoa: 'Khoa Ngoại', kho: KHO_CHINH, by: 'khang', at: '2026-09-29T16:20', stage: 3,
    note: 'Lịch mổ phiên ngày 01/10',
    lines: [L('VT008', 60), L('VT009', 24), L('VT003', 2), L('HC002', 10)],
    events: [ev('gui', 'khang', '2026-09-29T16:20'), ev('duyet-khoa', 'viet', '2026-09-29T16:48'), ev('xac-nhan', 'hung', '2026-09-30T07:55')]
  },
  {
    so: so(124), n: 124, khoa: 'Khoa Nội', kho: KHO_CHINH, by: 'hong', at: '2026-09-29T14:05', stage: 1,
    lines: [L('VT007', 10), L('VT002', 8)],
    events: [ev('gui', 'hong', '2026-09-29T14:05')]
  },
  {
    so: so(123), n: 123, khoa: 'Khoa Nhi', kho: KHO_CHINH, by: 'mai', at: '2026-09-29T10:30', stage: 4,
    lines: [L('VT001', 150), L('VT005', 40), L('VT009', 12)],
    events: [ev('gui', 'mai', '2026-09-29T10:30'), ev('duyet-khoa', 'huy', '2026-09-29T11:02'), ev('xac-nhan', 'hung', '2026-09-29T13:40'), ev('duyet', 'hanh', '2026-09-29T15:10')]
  },
  {
    so: so(122), n: 122, khoa: 'Khoa Nội', kho: KHO_CHINH, by: 'lan', at: '2026-09-29T09:10', stage: 0,
    note: 'Máy đo đường huyết phòng 3',
    lines: [L('VT006', 3)],
    events: [ev('tao', 'lan', '2026-09-29T09:10')]
  },
  {
    so: so(121), n: 121, khoa: 'Khoa Sản', kho: KHO_CHINH, by: 'anh', at: '2026-09-28T15:45', stage: 3,
    lines: [L('VT002', 20), L('VT008', 80), L('VT001', 100)],
    events: [ev('gui', 'anh', '2026-09-28T15:45'), ev('duyet-khoa', 'linh', '2026-09-28T16:30'), ev('xac-nhan', 'hung', '2026-09-29T08:05')]
  },
  {
    so: so(120), n: 120, khoa: 'Khoa Cấp cứu', kho: KHO_CHINH, by: 'ha', at: '2026-09-28T11:20', stage: 4,
    lines: [L('VT005', 80), L('VT004', 30), L('VT007', 15)],
    events: [ev('gui', 'ha', '2026-09-28T11:20'), ev('duyet-khoa', 'phuc', '2026-09-28T11:45'), ev('xac-nhan', 'hung', '2026-09-28T14:10'), ev('duyet', 'hanh', '2026-09-29T09:20')]
  },
  {
    so: so(119), n: 119, khoa: 'Khoa Nội', kho: KHO_CHINH, by: 'lan', at: '2026-09-28T08:30', stage: 4,
    note: 'Cơ số tủ trực tuần 39',
    lines: [L('VT001', 300), L('VT005', 100), L('VT008', 50), L('VT009', 12)],
    events: [ev('gui', 'lan', '2026-09-28T08:30'), ev('duyet-khoa', 'binh', '2026-09-28T09:05'), ev('xac-nhan', 'hung', '2026-09-28T10:40'), ev('duyet', 'hanh', '2026-09-29T14:25')]
  },
  {
    so: so(118), n: 118, khoa: 'Khoa Xét nghiệm', kho: KHO_CHINH, by: 'tram', at: '2026-09-27T14:00', stage: 5,
    lines: fefoPicks([L('VT010', 800), L('VT006', 5)]),
    events: [ev('gui', 'tram', '2026-09-27T14:00'), ev('duyet-khoa', 'thu', '2026-09-27T14:20'), ev('xac-nhan', 'hung', '2026-09-27T15:30'), ev('duyet', 'hanh', '2026-09-28T08:15'), ev('cap-phat', 'hung', '2026-09-28T09:20')]
  },
  {
    so: so(117), n: 117, khoa: 'Khoa Nội', kho: KHO_CHINH, by: 'lan', at: '2026-09-26T09:00', stage: 3,
    rejected: { stage: 3, by: 'hanh', at: '2026-09-26T15:20', reason: 'Găng tay size M đang thiếu, khoa đã lĩnh 20 hộp ngày 22/09. Đề nghị giảm còn 10 hộp rồi gửi lại.' },
    lines: [L('VT002', 30), L('VT007', 10)],
    events: [
      ev('gui', 'lan', '2026-09-26T09:00'), ev('duyet-khoa', 'binh', '2026-09-26T09:40'), ev('xac-nhan', 'hung', '2026-09-26T11:05'),
      ev('tu-choi', 'hanh', '2026-09-26T15:20', 'Găng tay size M đang thiếu, khoa đã lĩnh 20 hộp ngày 22/09. Đề nghị giảm còn 10 hộp rồi gửi lại.')
    ]
  },
  {
    so: so(116), n: 116, khoa: 'Khoa Ngoại', kho: KHO_CHINH, by: 'khang', at: '2026-09-26T08:00', stage: 5,
    lines: fefoPicks([L('VT008', 100), L('VT003', 3), L('HC002', 10)]),
    events: [ev('gui', 'khang', '2026-09-26T08:00'), ev('duyet-khoa', 'viet', '2026-09-26T08:35'), ev('xac-nhan', 'hung', '2026-09-26T10:00'), ev('duyet', 'hanh', '2026-09-26T13:45'), ev('cap-phat', 'hung', '2026-09-26T15:10')]
  },
  {
    so: so(115), n: 115, khoa: 'Khoa Nhi', kho: KHO_CHINH, by: 'mai', at: '2026-09-25T09:15', stage: 5,
    lines: fefoPicks([L('VT004', 50), L('VT005', 60), L('VT007', 10)]),
    events: [ev('gui', 'mai', '2026-09-25T09:15'), ev('duyet-khoa', 'huy', '2026-09-25T09:50'), ev('xac-nhan', 'hung', '2026-09-25T11:30'), ev('duyet', 'hanh', '2026-09-25T14:00'), ev('cap-phat', 'hung', '2026-09-26T08:40')]
  },
  {
    so: so(114), n: 114, khoa: 'Khoa Nội', kho: KHO_CHINH, by: 'lan', at: '2026-09-25T08:05', stage: 5,
    note: 'Cơ số tủ trực tuần 39',
    lines: fefoPicks([L('VT001', 200), L('VT004', 50), L('VT009', 12), L('VT006', 2)]),
    events: [ev('gui', 'lan', '2026-09-25T08:05'), ev('duyet-khoa', 'binh', '2026-09-25T08:40'), ev('xac-nhan', 'hung', '2026-09-25T10:15'), ev('duyet', 'hanh', '2026-09-25T13:30'), ev('cap-phat', 'hung', '2026-09-26T08:10')]
  },
  {
    so: so(113), n: 113, khoa: 'Khoa Sản', kho: KHO_CHINH, by: 'anh', at: '2026-09-24T10:10', stage: 1,
    rejected: { stage: 1, by: 'linh', at: '2026-09-24T11:00', reason: 'Khoa còn đủ gạc trong tủ trực, chưa cần lĩnh thêm.' },
    lines: [L('VT008', 120)],
    events: [ev('gui', 'anh', '2026-09-24T10:10'), ev('tu-choi', 'linh', '2026-09-24T11:00', 'Khoa còn đủ gạc trong tủ trực, chưa cần lĩnh thêm.')]
  },
  {
    so: so(112), n: 112, khoa: 'Khoa Cấp cứu', kho: KHO_CHINH, by: 'ha', at: '2026-09-24T07:50', stage: 5,
    lines: fefoPicks([L('VT001', 300), L('VT002', 20), L('VT008', 60)]),
    events: [ev('gui', 'ha', '2026-09-24T07:50'), ev('duyet-khoa', 'phuc', '2026-09-24T08:15'), ev('xac-nhan', 'hung', '2026-09-24T09:40'), ev('duyet', 'hanh', '2026-09-24T11:20'), ev('cap-phat', 'hung', '2026-09-24T14:05')]
  }
]

/* ---------- Generated history: n = 1…111, 01/07 – 23/09, all closed ---------- */

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6D2B79F5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const PROFILE: Record<string, string[]> = {
  'Khoa Nội': ['VT001', 'VT002', 'VT004', 'VT005', 'VT006', 'VT007', 'VT009'],
  'Khoa Ngoại': ['VT001', 'VT003', 'VT008', 'VT009', 'HC002', 'VT002'],
  'Khoa Cấp cứu': ['VT001', 'VT002', 'VT004', 'VT005', 'VT008', 'VT009', 'VT007'],
  'Khoa Xét nghiệm': ['VT010', 'VT006', 'HC001', 'VT002', 'HC002'],
  'Khoa Nhi': ['VT001', 'VT004', 'VT005', 'VT007', 'VT009'],
  'Khoa Sản': ['VT001', 'VT002', 'VT003', 'VT008', 'VT007']
}
const QTY: Record<string, number[]> = {
  VT001: [100, 200, 300], VT002: [10, 15, 20], VT003: [1, 2, 3], VT004: [30, 50, 80], VT005: [40, 60, 100], VT006: [2, 3, 5],
  VT007: [10, 15, 20], VT008: [40, 60, 100], VT009: [12, 24], VT010: [300, 500, 800], HC001: [1, 2], HC002: [5, 10, 20]
}
const REJECT_REASONS = [
  'Số lượng vượt định mức tháng của khoa, đề nghị chia làm hai đợt.',
  'Thiếu chữ ký y lệnh cho hóa chất xét nghiệm.',
  'Trùng với phiếu đã lĩnh trong tuần, đề nghị kiểm tra tủ trực.'
]

function nurseOf(khoa: string) {
  return PEOPLE.find(p => p.role === 'dd' && p.dept === khoa)!.key
}

function addMinutes(iso: string, m: number) {
  return toIso(new Date(toDate(iso).getTime() + m * 60000))
}

/** Next working morning (skips Sunday) at the given time */
function nextMorning(iso: string, rnd: () => number) {
  const d = toDate(iso)
  d.setDate(d.getDate() + 1)
  if (d.getDay() === 0) d.setDate(d.getDate() + 1)
  d.setHours(8, Math.floor(rnd() * 50), 0, 0)
  return toIso(d)
}

function generateHistory(): Slip[] {
  const rnd = mulberry32(651)
  const out: Slip[] = []
  const start = new Date(2026, 6, 1)
  for (let n = 1; n <= 111; n++) {
    const day = new Date(start)
    day.setDate(1 + Math.floor((n - 1) * (84 / 111)))
    if (day.getDay() === 0) day.setDate(day.getDate() + 1)
    day.setHours(7 + Math.floor(rnd() * 8), Math.floor(rnd() * 60), 0, 0)
    const at = toIso(day)
    const khoa = KHOA[Math.floor(rnd() * KHOA.length)]!
    const pool = [...PROFILE[khoa]!]
    const count = 2 + Math.floor(rnd() * 3)
    const lines: SlipLine[] = []
    for (let k = 0; k < count && pool.length; k++) {
      const ma = pool.splice(Math.floor(rnd() * pool.length), 1)[0]!
      const q = QTY[ma]!
      lines.push(L(ma, q[Math.floor(rnd() * q.length)]!))
    }
    const by = nurseOf(khoa)
    const head = headOf(khoa).key
    const events: SlipEvent[] = [ev('gui', by, at)]
    const t1 = addMinutes(at, 20 + Math.floor(rnd() * 60))
    const t2 = addMinutes(t1, 60 + Math.floor(rnd() * 90))
    const t3 = addMinutes(t2, 90 + Math.floor(rnd() * 150))
    const rejected = rnd() < 0.06
    let stage: Stage = 5
    let rej: Slip['rejected']
    if (rejected) {
      const reason = REJECT_REASONS[n % REJECT_REASONS.length]!
      events.push(ev('duyet-khoa', head, t1), ev('xac-nhan', 'hung', t2), ev('tu-choi', 'hanh', t3, reason))
      stage = 3
      rej = { stage: 3, by: 'hanh', at: t3, reason }
    } else {
      events.push(ev('duyet-khoa', head, t1), ev('xac-nhan', 'hung', t2), ev('duyet', 'hanh', t3), ev('cap-phat', 'hung', nextMorning(t3, rnd)))
    }
    out.push({
      so: so(n), n, khoa, kho: KHO_CHINH, by, at, stage,
      ...(rej ? { rejected: rej } : {}),
      lines: rejected ? lines : fefoPicks(lines),
      events
    })
  }
  return out
}

export function seedSlips(): Slip[] {
  return [...RECENT, ...generateHistory()].sort((a, b) => b.n - a.n)
}
