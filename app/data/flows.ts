import type { MonthFlow } from '~/types'
import { ITEMS, LOTS } from './catalog'

/** Twelve report months, oldest first: 10/2025 … 09/2026 */
export const MONTHS = Array.from({ length: 12 }, (_, i) => {
  const d = new Date(2025, 9 + i, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
})

/** Receipts that closed in the history months (see receipts.ts), so the report and documents agree */
const KNOWN_RECEIPTS: Record<string, Record<string, number>> = {
  '2026-09': { VT001: 2000, VT005: 800, VT010: 2000 },
  '2026-08': { HC002: 200, VT007: 300 },
  '2026-07': { VT010: 5000 }
}

function rng(seed: number) {
  let s = seed
  return () => {
    s = (s * 1103515245 + 12345) & 0x7FFFFFFF
    return s / 0x7FFFFFFF
  }
}

/**
 * Monthly receipts and issues per item. Built backwards from the physical stock on
 * 30/09/2026 so the September closing balance equals what is in the lots today.
 */
export function seedFlows(): Record<string, MonthFlow[]> {
  const out: Record<string, MonthFlow[]> = {}
  ITEMS.forEach((it, idx) => {
    const r = rng(97 + idx * 31)
    let closing = LOTS.filter(l => l.ma === it.ma).reduce((a, l) => a + l.sl, 0)
    const flows: MonthFlow[] = []
    for (let m = MONTHS.length - 1; m >= 0; m--) {
      const month = MONTHS[m]!
      const season = 1 + 0.12 * Math.sin(((m + 3) / 12) * Math.PI * 2)
      const xuat = Math.max(1, Math.round(it.dungTB * season * (0.82 + r() * 0.36)))
      let nhap = KNOWN_RECEIPTS[month]?.[it.ma] ?? 0
      let opening = closing + xuat - nhap
      if (!KNOWN_RECEIPTS[month]?.[it.ma] && opening > it.dungTB * 3) {
        // A delivery arrived this month: the month opened lean
        const target = Math.round(it.dungTB * (1 + r() * 0.6))
        nhap = Math.max(0, opening - target)
        opening = closing + xuat - nhap
      }
      if (opening < 0) {
        nhap += opening
        opening = 0
      }
      flows.unshift({ month, nhap, xuat })
      closing = opening
    }
    out[it.ma] = flows
  })
  return out
}
