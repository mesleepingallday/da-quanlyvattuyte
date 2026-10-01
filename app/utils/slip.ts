import type { Person, Receipt, RoleKey, Slip, SlipEvent, Tone } from '~/types'
import { item } from '~/data/catalog'
import { headOf } from '~/data/people'
import { daysSince } from './format'

/** The five steps a slip passes through after it is written */
export const STEPS: { label: string, role: RoleKey, wait: string }[] = [
  { label: 'Gửi phiếu', role: 'dd', wait: 'Nháp' },
  { label: 'Trưởng khoa duyệt', role: 'tk', wait: 'Chờ trưởng khoa duyệt' },
  { label: 'Kho xác nhận', role: 'kho', wait: 'Chờ kho xác nhận' },
  { label: 'P.VTTBYT duyệt', role: 'vt', wait: 'Chờ P.VTTBYT duyệt' },
  { label: 'Cấp phát', role: 'kho', wait: 'Chờ cấp phát' }
]

export type SlipStatusKind = 'draft' | 'returned' | 'waiting' | 'done' | 'rejected'

export interface SlipStatus {
  kind: SlipStatusKind
  label: string
  icon: string
  tone: Tone
}

export function slipStatus(s: Slip): SlipStatus {
  if (s.rejected) return { kind: 'rejected', label: 'Bị từ chối', icon: 'i-lucide-circle-x', tone: 'critical' }
  if (s.stage === 0 && s.returned) return { kind: 'returned', label: 'Kho trả lại', icon: 'i-lucide-undo-2', tone: 'warning' }
  if (s.stage === 0) return { kind: 'draft', label: 'Nháp', icon: 'i-lucide-circle-dashed', tone: 'neutral' }
  if (s.stage === 5) return { kind: 'done', label: 'Đã cấp phát', icon: 'i-lucide-circle-check', tone: 'ok' }
  return { kind: 'waiting', label: STEPS[s.stage]!.wait, icon: 'i-lucide-clock-3', tone: 'warning' }
}

/** Who acts next on the slip, for "Đang chờ …" lines */
export function waitingOn(s: Slip): { role: RoleKey, who?: string } | null {
  if (s.rejected || s.stage === 5) return null
  if (s.stage === 0) return { role: 'dd', who: s.by }
  if (s.stage === 1) return { role: 'tk', who: headOf(s.khoa).key }
  if (s.stage === 3) return { role: 'vt', who: 'hanh' }
  return { role: 'kho', who: 'hung' }
}

export type SlipAction = 'send' | 'approve-dept' | 'confirm' | 'approve' | 'issue' | 'fix'

/** The action this person can take on the slip right now, if any ("đến lượt bạn") */
export function myAction(s: Slip, u: Person | null): SlipAction | null {
  if (!u) return null
  if (s.rejected) return s.by === u.key && daysSince(s.rejected.at) <= 7 ? 'fix' : null
  switch (s.stage) {
    case 0: return s.by === u.key ? 'send' : null
    case 1: return u.role === 'tk' && u.dept === s.khoa ? 'approve-dept' : null
    case 2: return u.role === 'kho' ? 'confirm' : null
    case 3: return u.role === 'vt' ? 'approve' : null
    case 4: return u.role === 'kho' ? 'issue' : null
    default: return null
  }
}

export const ACTION_LABEL: Record<SlipAction, string> = {
  'send': 'Gửi duyệt',
  'approve-dept': 'Duyệt',
  'confirm': 'Xác nhận',
  'approve': 'Duyệt',
  'issue': 'Cấp phát',
  'fix': 'Sửa và gửi lại'
}

/** Past-tense toast titles; each keeps the verb of its button */
export const ACTION_DONE: Record<SlipAction, string> = {
  'send': 'Đã gửi duyệt',
  'approve-dept': 'Đã duyệt',
  'confirm': 'Đã xác nhận',
  'approve': 'Đã duyệt',
  'issue': 'Đã cấp phát',
  'fix': 'Đã gửi lại'
}

export const EVENT_LABEL: Record<SlipEvent['kind'], string> = {
  'tao': 'Tạo nháp',
  'gui': 'Gửi phiếu',
  'duyet-khoa': 'Trưởng khoa duyệt',
  'xac-nhan': 'Kho xác nhận',
  'duyet': 'P.VTTBYT duyệt',
  'cap-phat': 'Cấp phát',
  'tra-lai': 'Kho trả lại khoa',
  'tu-choi': 'Từ chối',
  'sua': 'Sửa phiếu'
}

export const slipValue = (s: Pick<Slip, 'lines'>) => s.lines.reduce((a, l) => a + l.sl * item(l.ma).gia, 0)

/** Who can see a slip: departments see their own; kho, P.VTTBYT and kế toán see all */
export function canSee(s: Slip, u: Person | null) {
  if (!u) return false
  if (u.role === 'dd' || u.role === 'tk') return s.khoa === u.dept
  return true
}

/* ---------- Receipts ---------- */

export const RECEIPT_STEPS: { label: string, role: RoleKey, wait: string }[] = [
  { label: 'Kiểm nhập', role: 'kho', wait: 'Đang kiểm nhập' },
  { label: 'Kế toán kiểm tra', role: 'kt', wait: 'Chờ kế toán' },
  { label: 'Ký duyệt', role: 'vt', wait: 'Chờ ký duyệt' },
  { label: 'Nhập kho', role: 'kho', wait: 'Đã nhập kho' }
]

export function receiptStatus(r: Receipt): SlipStatus {
  if (r.stage === 3) return { kind: 'done', label: 'Đã nhập kho', icon: 'i-lucide-circle-check', tone: 'ok' }
  return { kind: 'waiting', label: RECEIPT_STEPS[r.stage]!.wait, icon: 'i-lucide-clock-3', tone: 'warning' }
}

export type ReceiptAction = 'send' | 'check' | 'sign'

export function myReceiptAction(r: Receipt, u: Person | null): ReceiptAction | null {
  if (!u) return null
  if (r.stage === 0 && u.role === 'kho') return 'send'
  if (r.stage === 1 && u.role === 'kt') return 'check'
  if (r.stage === 2 && u.role === 'vt') return 'sign'
  return null
}

export const RECEIPT_ACTION_LABEL: Record<ReceiptAction, string> = {
  send: 'Chuyển kế toán',
  check: 'Xác nhận hóa đơn',
  sign: 'Ký duyệt nhập kho'
}

export const RECEIPT_ACTION_DONE: Record<ReceiptAction, string> = {
  send: 'Đã chuyển kế toán',
  check: 'Đã xác nhận hóa đơn',
  sign: 'Đã ký duyệt, hàng đã vào kho'
}

export const receiptValue = (r: Receipt) => r.lines.reduce((a, l) => a + l.sl * l.gia, 0)
export const priceIssues = (r: Receipt) => r.lines.filter(l => l.gia !== l.giaHd)
