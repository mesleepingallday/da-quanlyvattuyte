export const ROLES = ['Thủ kho', 'ĐD khoa', 'Trưởng P.VTTBYT', 'Kế toán'] as const
export type Role = typeof ROLES[number]

export function useRole() {
  const role = useState<Role>('role', () => 'Thủ kho')
  return { role, roles: ROLES }
}
