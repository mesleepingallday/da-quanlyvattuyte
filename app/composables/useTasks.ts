import type { SlipAction } from '~/utils/slip'
import { canSee, myAction, myReceiptAction } from '~/utils/slip'
import { daysSince } from '~/utils/format'

/** Order of work: things that unblock the most people come first */
const PRIORITY: Record<SlipAction, number> = { 'issue': 0, 'confirm': 1, 'approve': 1, 'approve-dept': 1, 'fix': 2, 'send': 3 }

export function useTasks() {
  const { user, role } = useSession()
  const { slips, receipts } = useStore()

  const visible = computed(() => slips.value.filter(s => canSee(s, user.value)))

  const slipTasks = computed(() => visible.value
    .map(s => ({ s, a: myAction(s, user.value) }))
    .filter((x): x is { s: typeof x.s, a: SlipAction } => x.a !== null)
    .sort((x, y) => PRIORITY[x.a] - PRIORITY[y.a] || x.s.at.localeCompare(y.s.at))
    .map(x => x.s))

  const receiptTasks = computed(() => receipts.value.filter(r => myReceiptAction(r, user.value)))

  /** Department roles follow their slips through the other steps */
  const following = computed(() => {
    if (role.value !== 'dd' && role.value !== 'tk') return []
    return visible.value
      .filter(s => !s.rejected && s.stage >= 1 && s.stage <= 4 && !myAction(s, user.value))
      .sort((a, b) => b.at.localeCompare(a.at))
  })

  const recentlyIssued = computed(() => {
    if (role.value !== 'dd' && role.value !== 'tk') return []
    return visible.value
      .filter((s) => {
        const ev = s.events.find(e => e.kind === 'cap-phat')
        return s.stage === 5 && ev && daysSince(ev.at) <= 3
      })
      .slice(0, 3)
  })

  const count = computed(() => slipTasks.value.length + receiptTasks.value.length)

  return { visible, slipTasks, receiptTasks, following, recentlyIssued, count }
}
