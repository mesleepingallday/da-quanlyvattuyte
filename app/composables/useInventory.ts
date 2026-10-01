import type { Item, Lot, Tone } from '~/types'
import { daysUntil, shelfTone } from '~/utils/format'

export interface StockInfo {
  item: Item
  /** All lots, earliest expiry first */
  lots: Lot[]
  usable: Lot[]
  total: number
  /** Quantity on approved slips waiting to be issued */
  reserved: number
  available: number
  quarantined: number
  expired: number
  nearest?: Lot
  nearestDays?: number
  low: boolean
  /** Rough days of cover at the average monthly issue rate */
  cover: number
  tone: Tone
}

export type AttentionKind = 'expired' | 'expiring' | 'low' | 'out'

export interface Attention {
  kind: AttentionKind
  item: Item
  lot?: Lot
  days?: number
  info: StockInfo
  tone: Tone
}

const rank: Record<Tone, number> = { critical: 0, warning: 1, info: 2, ok: 3, neutral: 4 }

export function useInventory() {
  const { lots, slips, items } = useStore()

  const reservedByItem = computed(() => {
    const m = new Map<string, number>()
    for (const s of slips.value) {
      if (s.stage !== 4 || s.rejected) continue
      for (const l of s.lines) m.set(l.ma, (m.get(l.ma) ?? 0) + l.sl)
    }
    return m
  })

  const stock = computed<StockInfo[]>(() => items.map((it) => {
    const all = lots.value.filter(l => l.ma === it.ma && l.sl > 0).sort((a, b) => a.hsd.localeCompare(b.hsd))
    const usable = all.filter(l => !l.q && daysUntil(l.hsd) > 0)
    const total = usable.reduce((a, l) => a + l.sl, 0)
    const reserved = Math.min(reservedByItem.value.get(it.ma) ?? 0, total)
    const nearest = usable[0]
    const nearestDays = nearest ? daysUntil(nearest.hsd) : undefined
    const expired = all.filter(l => !l.q && daysUntil(l.hsd) <= 0).reduce((a, l) => a + l.sl, 0)
    const low = total < it.tonMin
    const tones: Tone[] = [nearestDays !== undefined ? shelfTone(nearestDays) : 'neutral', total === 0 ? 'critical' : low ? 'warning' : 'neutral', expired ? 'critical' : 'neutral']
    return {
      item: it, lots: all, usable, total, reserved, available: total - reserved,
      quarantined: all.filter(l => l.q).reduce((a, l) => a + l.sl, 0),
      expired, nearest, nearestDays, low,
      cover: it.dungTB ? Math.round(total / (it.dungTB / 30)) : Infinity,
      tone: tones.sort((a, b) => rank[a] - rank[b])[0]!
    }
  }))

  const byMa = computed(() => new Map(stock.value.map(s => [s.item.ma, s])))
  const stockOf = (ma: string) => byMa.value.get(ma)!

  /** Lots and items that need someone to act, worst first. Quarantine is listed separately. */
  const attention = computed<Attention[]>(() => {
    const out: Attention[] = []
    for (const info of stock.value) {
      for (const lot of info.lots) {
        if (lot.q) continue
        const days = daysUntil(lot.hsd)
        if (days <= 0) out.push({ kind: 'expired', item: info.item, lot, days, info, tone: 'critical' })
        else if (days < 90) out.push({ kind: 'expiring', item: info.item, lot, days, info, tone: shelfTone(days) })
      }
      if (info.total === 0) out.push({ kind: 'out', item: info.item, info, tone: 'critical' })
      else if (info.low) out.push({ kind: 'low', item: info.item, info, tone: 'warning' })
    }
    return out.sort((a, b) => rank[a.tone] - rank[b.tone] || (a.days ?? 999) - (b.days ?? 999))
  })

  const quarantine = computed(() => lots.value.filter(l => l.q && l.sl > 0))

  return { stock, stockOf, attention, quarantine }
}
