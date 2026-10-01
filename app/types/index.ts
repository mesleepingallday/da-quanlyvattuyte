export interface VatTu {
  ma: string
  ten: string
  dvt: string
  nhom: string
  bq: string
  gia: number
  tonMin: number
}

export interface Lo {
  ma: string
  so: string
  hsd: string
  sl: number
  q?: boolean
}

export type PhieuStatus = 'W' | 'A' | 'D' | 'R' | 'N'

export interface PhieuItem {
  v: VatTu
  req: number
  lot?: Lo
}

export interface Phieu {
  n: number
  no: string
  khoa: string
  date: Date
  st: PhieuStatus
  items: PhieuItem[]
  value: number
  hh: number
  mm: number
  lan: PersonKey
}

export type PersonKey = 'lan' | 'binh' | 'hung' | 'hanh' | 'tuan'

export interface Person {
  n: string
  r: string
  i: string
  c: string
}
