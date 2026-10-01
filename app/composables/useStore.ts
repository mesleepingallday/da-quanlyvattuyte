import type { Lot, Pick, Receipt, ReceiptEvent, Slip, SlipEvent, SlipLine, Stage } from '~/types'
import { ITEMS, KHO_CHINH, LOTS, item } from '~/data/catalog'
import { seedReceipts } from '~/data/receipts'
import { seedSlips } from '~/data/slips'
import { NOW, daysUntil, pad, toIso } from '~/utils/format'

interface Db {
  v: number
  slips: Slip[]
  receipts: Receipt[]
  lots: Lot[]
  /** Minutes the demo clock has advanced through actions, so new events stay in order */
  tick: number
}

const VERSION = 3
const seed = (): Db => ({ v: VERSION, slips: seedSlips(), receipts: seedReceipts(), lots: structuredClone(LOTS), tick: 0 })

const useDb = createGlobalState(() => {
  const db = useLocalStorage<Db>('vtyt:v3:data', seed())
  if (db.value?.v !== VERSION || !Array.isArray(db.value.slips)) db.value = seed()
  return db
})

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T

/** FEFO: take from the issuable lot that expires first, then the next */
export function allocate(lots: Lot[], ma: string, qty: number) {
  const usable = lots.filter(l => l.ma === ma && !l.q && daysUntil(l.hsd) > 0 && l.sl > 0).sort((a, b) => a.hsd.localeCompare(b.hsd))
  const picks: Pick[] = []
  let left = qty
  for (const l of usable) {
    if (left <= 0) break
    const take = Math.min(l.sl, left)
    picks.push({ so: l.so, sl: take })
    left -= take
  }
  return { picks, short: Math.max(left, 0) }
}

export function useStore() {
  const db = useDb()

  const slips = computed(() => db.value.slips)
  const receipts = computed(() => db.value.receipts)
  const lots = computed(() => db.value.lots)

  /** Each action stamps the demo clock forward a little so the timeline stays ordered */
  function stamp() {
    db.value.tick += 1
    return toIso(new Date(NOW.getTime() + db.value.tick * 60000))
  }

  const findSlip = (so: string) => db.value.slips.find(s => s.so === so)
  const findReceipt = (so: string) => db.value.receipts.find(r => r.so === so)

  /** Runs a mutation on one slip and returns an undo function for the toast */
  function mutateSlip(so: string, fn: (s: Slip) => void) {
    const s = findSlip(so)
    if (!s) return () => {}
    const before = clone(s)
    const lotsBefore = clone(db.value.lots)
    fn(s)
    return () => {
      const i = db.value.slips.findIndex(x => x.so === so)
      if (i >= 0) db.value.slips[i] = before
      db.value.lots = lotsBefore
    }
  }

  function advance(so: string, by: string, from: Stage, kind: SlipEvent['kind'], note?: string) {
    return mutateSlip(so, (s) => {
      if (s.stage !== from || s.rejected) return
      s.stage = (from + 1) as Stage
      s.events.push({ at: stamp(), by, kind, ...(note ? { note } : {}) })
    })
  }

  const submit = (so: string, by: string) => mutateSlip(so, (s) => {
    if (s.stage !== 0) return
    s.stage = 1
    s.returned = undefined
    s.events.push({ at: stamp(), by, kind: 'gui' })
  })
  const approveDept = (so: string, by: string) => advance(so, by, 1, 'duyet-khoa')
  const confirm = (so: string, by: string) => advance(so, by, 2, 'xac-nhan')
  const approve = (so: string, by: string) => advance(so, by, 3, 'duyet')

  const reject = (so: string, by: string, reason: string) => mutateSlip(so, (s) => {
    const at = stamp()
    s.rejected = { stage: s.stage, by, at, reason }
    s.events.push({ at, by, kind: 'tu-choi', note: reason })
  })

  /** Kho sends a slip back to the department to correct (stage 2 → 0) */
  const returnToDept = (so: string, by: string, reason: string) => mutateSlip(so, (s) => {
    const at = stamp()
    s.stage = 0
    s.returned = { by, at, reason }
    s.events.push({ at, by, kind: 'tra-lai', note: reason })
  })

  /** Issue an approved slip: record picks per line and take them out of the lots */
  const issue = (so: string, by: string, picks: Record<string, Pick[]>) => mutateSlip(so, (s) => {
    if (s.stage !== 4) return
    for (const line of s.lines) {
      line.picks = picks[line.ma] ?? []
      for (const p of line.picks) {
        const lot = db.value.lots.find(l => l.ma === line.ma && l.so === p.so)
        if (lot) lot.sl = Math.max(0, lot.sl - p.sl)
      }
    }
    s.stage = 5
    s.events.push({ at: stamp(), by, kind: 'cap-phat' })
  })

  function nextSlipNo() {
    const n = Math.max(...db.value.slips.map(s => s.n)) + 1
    return { n, so: `PL-2026-${pad(n).padStart(4, '0')}` }
  }

  /** Create a slip from the compose screen; `send` false keeps it as a draft */
  function createSlip(input: { by: string, khoa: string, lines: SlipLine[], note?: string, send: boolean }) {
    const { n, so } = nextSlipNo()
    const at = stamp()
    const slip: Slip = {
      so, n, khoa: input.khoa, kho: KHO_CHINH, by: input.by, at,
      stage: input.send ? 1 : 0,
      lines: input.lines.filter(l => l.sl > 0).map(l => ({ ma: l.ma, sl: l.sl })),
      ...(input.note?.trim() ? { note: input.note.trim() } : {}),
      events: [{ at, by: input.by, kind: input.send ? 'gui' : 'tao' }]
    }
    db.value.slips.unshift(slip)
    return slip
  }

  function updateDraft(so: string, lines: SlipLine[], note?: string) {
    const s = findSlip(so)
    if (!s || s.stage !== 0) return
    s.lines = lines.filter(l => l.sl > 0).map(l => ({ ma: l.ma, sl: l.sl }))
    s.note = note?.trim() || undefined
  }

  function deleteDraft(so: string) {
    const i = db.value.slips.findIndex(s => s.so === so && s.stage === 0)
    if (i < 0) return () => {}
    const [removed] = db.value.slips.splice(i, 1)
    return () => { db.value.slips.splice(i, 0, removed!) }
  }

  /* ---------- Receipts ---------- */

  function mutateReceipt(so: string, fn: (r: Receipt) => void) {
    const r = findReceipt(so)
    if (!r) return () => {}
    const before = clone(r)
    const lotsBefore = clone(db.value.lots)
    fn(r)
    return () => {
      const i = db.value.receipts.findIndex(x => x.so === so)
      if (i >= 0) db.value.receipts[i] = before
      db.value.lots = lotsBefore
    }
  }

  const setLineResult = (so: string, idx: number, dat: boolean, ghiChu?: string) => mutateReceipt(so, (r) => {
    const line = r.lines[idx]
    if (!line || r.stage !== 0) return
    line.dat = dat
    line.ghiChu = dat ? undefined : (ghiChu ?? line.ghiChu)
  })

  /** Accept the invoice price as the contract price after checking with the supplier */
  const correctPrice = (so: string, idx: number) => mutateReceipt(so, (r) => {
    const line = r.lines[idx]
    if (line) line.gia = line.giaHd
  })

  function receiptStep(so: string, by: string, from: Receipt['stage'], kind: ReceiptEvent['kind'], note?: string) {
    return mutateReceipt(so, (r) => {
      if (r.stage !== from) return
      r.stage = (from + 1) as Receipt['stage']
      r.events.push({ at: stamp(), by, kind, ...(note ? { note } : {}) })
      if (r.stage === 3) {
        // Signed: lots enter stock; failed lines go to quarantine
        for (const l of r.lines) {
          db.value.lots.push({
            ma: l.ma, so: l.so, hsd: l.hsd, sl: l.sl, ncc: r.ncc, ngayNhap: toIso(NOW, false),
            viTri: l.dat ? item(l.ma).viTri : 'Khu biệt trữ',
            ...(l.dat ? {} : { q: true, qLyDo: l.ghiChu || 'Không đạt khi kiểm nhập' })
          })
        }
        r.events.push({ at: stamp(), by, kind: 'nhap-kho' })
      }
    })
  }
  const sendToAccounting = (so: string, by: string) => receiptStep(so, by, 0, 'kiem-nhap')
  const accountingOk = (so: string, by: string) => receiptStep(so, by, 1, 'ke-toan')
  const signReceipt = (so: string, by: string) => receiptStep(so, by, 2, 'ky')

  function reset() {
    db.value = seed()
  }

  return {
    slips, receipts, lots, findSlip, findReceipt,
    submit, approveDept, confirm, approve, reject, returnToDept, issue,
    createSlip, updateDraft, deleteDraft,
    setLineResult, correctPrice, sendToAccounting, accountingOk, signReceipt,
    reset, items: ITEMS
  }
}
