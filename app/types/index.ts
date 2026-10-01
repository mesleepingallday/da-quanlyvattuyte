/** dd = ĐD/KTV khoa, tk = Trưởng khoa, kho = Thủ kho, vt = Trưởng P.VTTBYT, kt = Kế toán dược */
export type RoleKey = 'dd' | 'tk' | 'kho' | 'vt' | 'kt'

export interface Person {
  key: string
  name: string
  /** Given name, used in greetings ("Xin chào, Lan") */
  given: string
  initials: string
  role: RoleKey
  title: string
  dept?: string
  code: string
  /** Avatar hue (OKLCH degrees) so each person keeps one color everywhere */
  hue: number
  demo?: boolean
}

/** Storage condition: room 15–25 °C, cool 8–15 °C, cold 2–8 °C */
export type Storage = 'phong' | 'mat' | 'lanh'

export interface Item {
  ma: string
  ten: string
  dvt: string
  nhom: string
  bq: Storage
  gia: number
  tonMin: number
  soDk: string
  bhyt: boolean
  img?: string
  viTri: string
  quyCach: string
  /** Average monthly issue, in dvt */
  dungTB: number
}

export interface Lot {
  ma: string
  so: string
  /** ISO date */
  hsd: string
  sl: number
  viTri: string
  ncc: string
  ngayNhap: string
  /** Quarantined (biệt trữ): physically present, not issuable */
  q?: boolean
  qLyDo?: string
}

/**
 * Requisition slip stages (QĐ 651, xuất kho):
 * 0 Nháp → 1 Trưởng khoa duyệt → 2 Kho xác nhận → 3 Trưởng P.VTTBYT duyệt → 4 Cấp phát → 5 Đã cấp phát
 */
export type Stage = 0 | 1 | 2 | 3 | 4 | 5

export interface Pick {
  so: string
  sl: number
}

export interface SlipLine {
  ma: string
  sl: number
  /** Lots actually issued (set when issued) */
  picks?: Pick[]
}

export type EventKind = 'tao' | 'gui' | 'duyet-khoa' | 'xac-nhan' | 'duyet' | 'cap-phat' | 'tra-lai' | 'tu-choi' | 'sua'

export interface SlipEvent {
  at: string
  by: string
  kind: EventKind
  note?: string
}

export interface Slip {
  so: string
  n: number
  khoa: string
  kho: string
  by: string
  at: string
  stage: Stage
  rejected?: { stage: Stage, by: string, at: string, reason: string }
  returned?: { by: string, at: string, reason: string }
  lines: SlipLine[]
  note?: string
  events: SlipEvent[]
}

/**
 * Goods receipt stages (QĐ 651, nhập kho):
 * 0 Kiểm nhập → 1 Kế toán kiểm tra hóa đơn → 2 Trưởng P.VTTBYT ký → 3 Đã nhập kho
 */
export type ReceiptStage = 0 | 1 | 2 | 3

export interface ReceiptLine {
  ma: string
  so: string
  hsd: string
  sl: number
  gia: number
  /** Contract price for this item */
  giaHd: number
  /** Passed inspection; false sends the lot to quarantine */
  dat: boolean
  ghiChu?: string
}

export type ReceiptEventKind = 'nhan' | 'kiem-nhap' | 'ke-toan' | 'ky' | 'nhap-kho'

export interface ReceiptEvent {
  at: string
  by: string
  kind: ReceiptEventKind
  note?: string
}

export interface Receipt {
  so: string
  ncc: string
  hd: string
  hoaDon: string
  at: string
  by: string
  stage: ReceiptStage
  lines: ReceiptLine[]
  events: ReceiptEvent[]
}

/** One month of stock movement for one item */
export interface MonthFlow {
  /** 'YYYY-MM' */
  month: string
  nhap: number
  xuat: number
}

export type Tone = 'critical' | 'warning' | 'ok' | 'neutral' | 'info'

/** One step of a document's approval path, for the order-tracker view */
export interface Step {
  label: string
  state: 'done' | 'current' | 'rejected' | 'todo' | 'skipped'
  by?: string
  at?: string
}
