import type { Tone } from '~/types'

/**
 * Demo clock. Sample data is written against 30/09/2026 10:15, so "today", "hôm qua" and
 * expiry countdowns stay meaningful whenever the demo is opened.
 */
export const NOW = new Date(2026, 8, 30, 10, 15)
export const TODAY = new Date(2026, 8, 30)

const nfmt = new Intl.NumberFormat('vi-VN')
const n1 = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 })

export const nf = (n: number) => nfmt.format(n)
export const money = (n: number) => `${nfmt.format(Math.round(n))} ₫`

/** 15.495.000 → "15,5 triệu ₫"; 1.360.000.000 → "1,36 tỷ ₫" */
export function moneyShort(n: number) {
  if (n >= 1e9) return `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(n / 1e9)} tỷ ₫`
  if (n >= 1e6) return `${n1.format(n / 1e6)} triệu ₫`
  if (n >= 1e4) return `${n1.format(n / 1e3)} nghìn ₫`
  return money(n)
}

export const pad = (n: number) => String(n).padStart(2, '0')

/** Parses 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:mm' as local time */
export function toDate(iso: string) {
  const [d, t] = iso.split('T') as [string, string | undefined]
  const [y, m, day] = d.split('-').map(Number) as [number, number, number]
  const [hh, mm] = (t ?? '00:00').split(':').map(Number) as [number, number]
  return new Date(y, m - 1, day, hh, mm)
}

export function toIso(d: Date, withTime = true) {
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  return withTime ? `${date}T${pad(d.getHours())}:${pad(d.getMinutes())}` : date
}

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const dayDiff = (a: Date, b: Date) => Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / 864e5)

export const fd = (iso: string) => {
  const d = toDate(iso)
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
}
export const fdShort = (iso: string) => {
  const d = toDate(iso)
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`
}
export const time = (iso: string) => {
  const d = toDate(iso)
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** Days from today until the date (negative when past) */
export const daysUntil = (iso: string) => dayDiff(toDate(iso), TODAY)
/** Whole days since the timestamp */
export const daysSince = (iso: string) => dayDiff(NOW, toDate(iso))

export const WEEKDAYS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']

/** "Thứ Tư, 30 tháng 9" */
export function longDate(d: Date = TODAY) {
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} tháng ${d.getMonth() + 1}`
}

/** Section label for date-grouped lists: Hôm nay / Hôm qua / Thứ Hai / Tuần trước / Tháng 8 */
export function dayGroup(iso: string) {
  const d = toDate(iso)
  const diff = dayDiff(NOW, d)
  if (diff <= 0) return 'Hôm nay'
  if (diff === 1) return 'Hôm qua'
  if (diff < 7) return WEEKDAYS[d.getDay()]!
  if (diff < 14) return 'Tuần trước'
  if (d.getMonth() === NOW.getMonth() && d.getFullYear() === NOW.getFullYear()) return 'Đầu tháng này'
  return `Tháng ${d.getMonth() + 1}/${d.getFullYear()}`
}

/** Compact timestamp for list rows: 09:41 / Hôm qua / Thứ Hai / 28/09 */
export function whenShort(iso: string) {
  const diff = dayDiff(NOW, toDate(iso))
  if (diff <= 0) return time(iso)
  if (diff === 1) return 'Hôm qua'
  if (diff < 7) return WEEKDAYS[toDate(iso).getDay()]!
  return fdShort(iso)
}

/** Readable timestamp for timelines: "5 phút trước", "Hôm qua lúc 16:20", "28/09 lúc 08:30" */
export function ago(iso: string) {
  const d = toDate(iso)
  const mins = Math.round((NOW.getTime() - d.getTime()) / 60000)
  const diff = dayDiff(NOW, d)
  if (mins < 1) return 'Vừa xong'
  if (mins < 60 && diff === 0) return `${mins} phút trước`
  if (diff === 0) return `Hôm nay lúc ${time(iso)}`
  if (diff === 1) return `Hôm qua lúc ${time(iso)}`
  return `${fdShort(iso)} lúc ${time(iso)}`
}

/** Full timestamp for history logs: "Hôm qua lúc 16:20", "Thứ Bảy, 26/09 lúc 09:00", "14/08/2026 lúc 10:15" */
export function when(iso: string) {
  const d = toDate(iso)
  const diff = dayDiff(NOW, d)
  if (diff <= 0) return `Hôm nay lúc ${time(iso)}`
  if (diff === 1) return `Hôm qua lúc ${time(iso)}`
  if (diff < 7) return `${WEEKDAYS[d.getDay()]}, ${fdShort(iso)} lúc ${time(iso)}`
  return `${fd(iso)} lúc ${time(iso)}`
}

/** How long something has been waiting, for "đã chờ" hints */
export function waited(iso: string) {
  const mins = Math.round((NOW.getTime() - toDate(iso).getTime()) / 60000)
  if (mins < 60) return `${Math.max(mins, 1)} phút`
  const h = Math.floor(mins / 60)
  if (h < 24) return `${h} giờ`
  return `${Math.floor(h / 24)} ngày`
}

export const monthLabel = (ym: string) => {
  const [y, m] = ym.split('-').map(Number) as [number, number]
  return `Tháng ${m}/${y}`
}

/** Shelf-life tone: expired or under 30 days is critical, under 90 days a warning */
export function shelfTone(days: number): Tone {
  if (days < 30) return 'critical'
  if (days < 90) return 'warning'
  return 'neutral'
}

/** "còn 12 ngày" / "hết hạn hôm nay" / "đã hết hạn 5 ngày" */
export function shelfText(days: number) {
  if (days > 0) return `còn ${nf(days)} ngày`
  if (days === 0) return 'hết hạn hôm nay'
  return `hết hạn ${nf(-days)} ngày`
}

/** Text color class for a tone */
export const toneText: Record<Tone, string> = {
  critical: 'text-error',
  warning: 'text-warning',
  ok: 'text-success',
  info: 'text-info',
  neutral: 'text-muted'
}

/** Mark (dot/bar) background for a tone */
export const toneMark: Record<Tone, string> = {
  critical: 'bg-(--mark-red)',
  warning: 'bg-(--mark-orange)',
  ok: 'bg-(--mark-green)',
  info: 'bg-(--mark-cyan)',
  neutral: 'bg-(--mark-gray)'
}

/** Amount in Vietnamese words for vouchers: 2.210.000 → "Hai triệu hai trăm mười nghìn đồng" */
export function docSo(n: number) {
  const D = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín']
  const group = (g: number, full: boolean) => {
    const h = Math.floor(g / 100)
    const t = Math.floor((g % 100) / 10)
    const u = g % 10
    const out: string[] = []
    if (full || h > 0) out.push(`${D[h]} trăm`)
    if (t > 1) {
      out.push(`${D[t]} mươi`)
      if (u === 1) out.push('mốt')
      else if (u === 5) out.push('lăm')
      else if (u > 0) out.push(D[u]!)
    } else if (t === 1) {
      out.push('mười')
      if (u === 5) out.push('lăm')
      else if (u > 0) out.push(D[u]!)
    } else if (u > 0) {
      if (full || h > 0) out.push('linh')
      out.push(D[u]!)
    }
    return out.join(' ')
  }
  const units = ['', 'nghìn', 'triệu', 'tỷ']
  let v = Math.round(Math.abs(n))
  if (v === 0) return 'Không đồng'
  const groups: number[] = []
  while (v > 0) {
    groups.push(v % 1000)
    v = Math.floor(v / 1000)
  }
  const words: string[] = []
  for (let i = groups.length - 1; i >= 0; i--) {
    if (groups[i] === 0) continue
    words.push([group(groups[i]!, i < groups.length - 1), units[i % 4]].filter(Boolean).join(' '))
  }
  const s = `${words.join(' ')} đồng`
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/** Location for use mid-sentence: shelf codes read "kệ A1-02", named places stay as words */
export const place = (viTri: string) => /^[A-Z]\d/.test(viTri) ? `kệ ${viTri}` : viTri.charAt(0).toLowerCase() + viTri.slice(1)

/** Remove Vietnamese diacritics for forgiving search ("gang tay" finds "Găng tay") */
export function fold(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase()
}
