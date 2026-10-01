import type { RoleKey } from '~/types'
import { myAction, myReceiptAction } from '~/utils/slip'

export interface NavItem {
  key: 'today' | 'slips' | 'receipts' | 'stock' | 'reports'
  label: string
  to: string
  icon: string
  badge?: number
}

const ALL: Record<NavItem['key'], Omit<NavItem, 'badge'>> = {
  today: { key: 'today', label: 'Hôm nay', to: '/', icon: 'today' },
  slips: { key: 'slips', label: 'Phiếu lĩnh', to: '/phieu', icon: 'i-lucide-clipboard-list' },
  receipts: { key: 'receipts', label: 'Nhập kho', to: '/nhap-kho', icon: 'i-lucide-truck' },
  stock: { key: 'stock', label: 'Tồn kho', to: '/kho', icon: 'i-lucide-boxes' },
  reports: { key: 'reports', label: 'Báo cáo', to: '/bao-cao', icon: 'i-lucide-chart-column' }
}

/** Each role sees only the places it works in */
const BY_ROLE: Record<RoleKey, NavItem['key'][]> = {
  dd: ['today', 'slips', 'stock'],
  tk: ['today', 'slips', 'stock', 'reports'],
  kho: ['today', 'slips', 'receipts', 'stock', 'reports'],
  vt: ['today', 'slips', 'receipts', 'stock', 'reports'],
  kt: ['today', 'receipts', 'stock', 'reports']
}

export function useNav() {
  const { user, role } = useSession()
  const { slips, receipts } = useStore()
  const route = useRoute()
  const searchOpen = useState('search-open', () => false)
  const scanOpen = useState('scan-open', () => false)

  const slipBadge = computed(() => slips.value.filter(s => myAction(s, user.value)).length)
  const receiptBadge = computed(() => receipts.value.filter(r => myReceiptAction(r, user.value)).length)

  const items = computed<NavItem[]>(() => (role.value ? BY_ROLE[role.value] : []).map(k => ({
    ...ALL[k],
    badge: k === 'slips' ? slipBadge.value : k === 'receipts' ? receiptBadge.value : undefined
  })))

  const isActive = (to: string) => to === '/' ? route.path === '/' : route.path === to || route.path.startsWith(`${to}/`)

  /** The role's main job, given the round button next to the tab bar */
  const primary = computed(() => {
    if (role.value === 'dd') return { label: 'Lập phiếu lĩnh', icon: 'i-lucide-plus', run: () => navigateTo('/lap-phieu') }
    if (role.value === 'kho') return { label: 'Quét mã lô', icon: 'i-lucide-scan-barcode', run: () => { scanOpen.value = true } }
    return { label: 'Tìm kiếm', icon: 'i-lucide-search', run: () => { searchOpen.value = true } }
  })

  return { items, isActive, primary, searchOpen, scanOpen }
}
