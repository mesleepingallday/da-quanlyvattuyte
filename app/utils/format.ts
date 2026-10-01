export const TODAY = new Date(2026, 8, 30)

const nfmt = new Intl.NumberFormat('vi-VN')
export const nf = (n: number) => nfmt.format(n)
export const money = (n: number) => nf(n) + ' ₫'
export const pad = (n: number) => String(n).padStart(2, '0')
export const fd = (d: Date) => pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear()
export const pd = (s: string) => {
  const [y, m, d] = s.split('-').map(Number) as [number, number, number]
  return new Date(y, m - 1, d)
}
export const days = (d: Date) => Math.round((d.getTime() - TODAY.getTime()) / 864e5)

export type UiColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'

/** Slip status -> UBadge color */
export const STATUS_COLOR: Record<'W' | 'A' | 'D' | 'R' | 'N', UiColor> = {
  W: 'warning', A: 'info', D: 'success', R: 'error', N: 'neutral'
}

/** Days-left tone -> text class */
export const toneClass = (d: number) => d < 30 ? 'text-error' : d < 90 ? 'text-warning' : 'text-success'
