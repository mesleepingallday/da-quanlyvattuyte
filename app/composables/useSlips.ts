import type { Phieu, PhieuStatus } from '~/types'
import { buildSlips } from '~/data/sample'

export function useSlips() {
  const slips = useState<Phieu[]>('slips', () => buildSlips())
  const pendingCount = computed(() => slips.value.filter(s => s.st === 'W').length)

  function setStatus(n: number, st: PhieuStatus) {
    const s = slips.value.find(x => x.n === n)
    if (s) s.st = st
  }

  /** Approve selected slips that are waiting; returns how many changed. */
  function bulkApprove(ids: number[]) {
    let c = 0
    const set = new Set(ids)
    for (const s of slips.value) {
      if (set.has(s.n) && s.st === 'W') {
        s.st = 'A'
        c++
      }
    }
    return c
  }

  return { slips, pendingCount, setStatus, bulkApprove }
}
