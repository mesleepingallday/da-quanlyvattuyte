import type { Slip } from '~/types'
import type { SlipAction } from '~/utils/slip'
import { ACTION_DONE } from '~/utils/slip'

/** What happens next, said in the toast so people know where the slip went */
const NEXT: Partial<Record<SlipAction, string>> = {
  'send': 'Đang chờ trưởng khoa duyệt.',
  'approve-dept': 'Phiếu đã chuyển đến kho xác nhận.',
  'confirm': 'Phiếu đã chuyển P.VTTBYT duyệt.',
  'approve': 'Kho có thể cấp phát phiếu này.'
}

export function useSlipActions() {
  const store = useStore()
  const { user } = useSession()
  const toast = useToast()
  const router = useRouter()
  const reason = useState('slip-reason', () => ({ open: false, so: '', mode: 'reject' as 'reject' | 'return' }))

  function done(title: string, description: string | undefined, undo: () => void) {
    toast.add({
      title,
      description,
      icon: 'i-lucide-circle-check',
      color: 'success',
      actions: [{
        label: 'Hoàn tác',
        color: 'neutral',
        variant: 'soft',
        size: 'sm',
        onClick: () => {
          undo()
          toast.add({ title: 'Đã hoàn tác', icon: 'i-lucide-undo-2', color: 'neutral' })
        }
      }]
    })
  }

  function run(action: SlipAction, s: Slip) {
    const u = user.value
    if (!u) return
    if (action === 'issue') return router.push(`/cap-phat/${s.so}`)
    if (action === 'fix') return router.push({ path: '/lap-phieu', query: { tu: s.so } })
    const undo = {
      'send': () => store.submit(s.so, u.key),
      'approve-dept': () => store.approveDept(s.so, u.key),
      'confirm': () => store.confirm(s.so, u.key),
      'approve': () => store.approve(s.so, u.key)
    }[action]()
    done(`${ACTION_DONE[action]} ${s.so}`, NEXT[action], undo)
  }

  const openReject = (s: Slip) => { reason.value = { open: true, so: s.so, mode: 'reject' } }
  const openReturn = (s: Slip) => { reason.value = { open: true, so: s.so, mode: 'return' } }

  function submitReason(text: string) {
    const u = user.value
    const { so, mode } = reason.value
    if (!u || !text.trim()) return
    const undo = mode === 'reject' ? store.reject(so, u.key, text.trim()) : store.returnToDept(so, u.key, text.trim())
    reason.value = { ...reason.value, open: false }
    done(mode === 'reject' ? `Đã từ chối ${so}` : `Đã trả lại ${so}`, 'Người lập phiếu sẽ thấy lý do bạn ghi.', undo)
  }

  return { run, openReject, openReturn, reason, submitReason }
}
