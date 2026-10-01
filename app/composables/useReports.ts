import type { Item } from '~/types'
import { KHOA } from '~/data/people'
import { MONTHS, seedFlows } from '~/data/flows'
import { item } from '~/data/catalog'
import { NOW, toIso } from '~/utils/format'

const FLOWS = seedFlows()
const CURRENT = MONTHS[MONTHS.length - 1]!

export interface XntRow {
  item: Item
  dau: number
  nhap: number
  xuat: number
  cuoi: number
}

export function useReports() {
  const { slips, receipts, items, lots } = useStore()
  const nowIso = toIso(NOW)

  /** Movements made while using the demo (after the demo clock), added to the current month */
  const live = computed(() => {
    const nhap = new Map<string, number>()
    const xuat = new Map<string, number>()
    for (const s of slips.value) {
      const ev = s.events.find(e => e.kind === 'cap-phat')
      if (!ev || ev.at <= nowIso) continue
      for (const l of s.lines) for (const p of l.picks ?? []) xuat.set(l.ma, (xuat.get(l.ma) ?? 0) + p.sl)
    }
    for (const r of receipts.value) {
      const ev = r.events.find(e => e.kind === 'nhap-kho')
      if (!ev || ev.at <= nowIso) continue
      for (const l of r.lines) nhap.set(l.ma, (nhap.get(l.ma) ?? 0) + l.sl)
    }
    return { nhap, xuat }
  })

  /** A month's movements; the current month includes what was done during the demo */
  function flowAt(ma: string, mi: number) {
    const f = FLOWS[ma]![mi]!
    if (MONTHS[mi] !== CURRENT) return { nhap: f.nhap, xuat: f.xuat }
    return { nhap: f.nhap + (live.value.nhap.get(ma) ?? 0), xuat: f.xuat + (live.value.xuat.get(ma) ?? 0) }
  }

  function xnt(month: string): XntRow[] {
    const mi = MONTHS.indexOf(month)
    return items.map((it) => {
      // Physical stock today, then walk back to the end of the requested month
      let cuoi = lots.value.filter(l => l.ma === it.ma).reduce((a, l) => a + l.sl, 0)
      for (let m = MONTHS.length - 1; m > mi; m--) {
        const f = flowAt(it.ma, m)
        cuoi = cuoi - f.nhap + f.xuat
      }
      const { nhap, xuat } = flowAt(it.ma, mi)
      return { item: it, dau: cuoi - nhap + xuat, nhap, xuat, cuoi }
    })
  }

  /** Monthly issued quantity for one item, oldest first */
  function usage(ma: string, months = 6) {
    return MONTHS.slice(-months).map((month) => ({ month, xuat: flowAt(ma, MONTHS.indexOf(month)).xuat }))
  }

  /** Issued value per department in a month, from the slips themselves */
  function byDept(month: string) {
    const totals = new Map<string, { value: number, slips: number }>(KHOA.map(k => [k, { value: 0, slips: 0 }]))
    for (const s of slips.value) {
      const ev = s.events.find(e => e.kind === 'cap-phat')
      if (!ev || !ev.at.startsWith(month)) continue
      const t = totals.get(s.khoa)!
      t.slips++
      for (const l of s.lines) for (const p of l.picks ?? []) t.value += p.sl * item(l.ma).gia
    }
    return [...totals.entries()].map(([khoa, t]) => ({ khoa, ...t })).sort((a, b) => b.value - a.value)
  }

  /** Suggested order for next month (QĐ 651 dự trù): 3-month average issue × 1,2 − closing stock */
  function forecast() {
    const rows = xnt(CURRENT)
    return rows.map((r) => {
      const last3 = FLOWS[r.item.ma]!.slice(-3)
      const avg = last3.reduce((a, f) => a + f.xuat, 0) / 3
      const raw = Math.max(0, avg * 1.2 - r.cuoi)
      const step = avg >= 500 ? 100 : avg >= 50 ? 10 : 1
      return { item: r.item, avg: Math.round(avg), cuoi: r.cuoi, goiY: Math.ceil(raw / step) * step }
    })
  }

  return { months: MONTHS, current: CURRENT, xnt, usage, byDept, forecast }
}
