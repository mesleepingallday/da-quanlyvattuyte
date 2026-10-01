import type { Person, RoleKey } from '~/types'

export const KHOA = ['Khoa Nội', 'Khoa Ngoại', 'Khoa Cấp cứu', 'Khoa Xét nghiệm', 'Khoa Nhi', 'Khoa Sản'] as const

export const ROLE_LABEL: Record<RoleKey, string> = {
  dd: 'Điều dưỡng khoa',
  tk: 'Trưởng khoa',
  kho: 'Thủ kho',
  vt: 'Trưởng P.VTTBYT',
  kt: 'Kế toán dược'
}

export const PEOPLE: Person[] = [
  // Demo accounts (can sign in)
  { key: 'lan', name: 'Nguyễn Thị Lan', given: 'Lan', initials: 'NL', role: 'dd', title: 'Điều dưỡng', dept: 'Khoa Nội', code: 'NV0231', hue: 215, demo: true },
  { key: 'binh', name: 'Võ Thanh Bình', given: 'Bình', initials: 'VB', role: 'tk', title: 'Trưởng khoa Nội', dept: 'Khoa Nội', code: 'NV0105', hue: 60, demo: true },
  { key: 'hung', name: 'Trần Văn Hùng', given: 'Hùng', initials: 'TH', role: 'kho', title: 'Thủ kho', code: 'NV0412', hue: 160, demo: true },
  { key: 'hanh', name: 'Lê Thị Kim Hạnh', given: 'Hạnh', initials: 'LH', role: 'vt', title: 'Trưởng P.VTTBYT', code: 'NV0058', hue: 300, demo: true },
  { key: 'tuan', name: 'Phạm Minh Tuấn', given: 'Tuấn', initials: 'PT', role: 'kt', title: 'Kế toán dược', code: 'NV0377', hue: 25, demo: true },
  // Other staff who appear in the data
  { key: 'hong', name: 'Võ Thị Hồng', given: 'Hồng', initials: 'VH', role: 'dd', title: 'Điều dưỡng', dept: 'Khoa Nội', code: 'NV0244', hue: 250 },
  { key: 'ha', name: 'Phạm Thu Hà', given: 'Hà', initials: 'PH', role: 'dd', title: 'Điều dưỡng', dept: 'Khoa Cấp cứu', code: 'NV0318', hue: 340 },
  { key: 'phuc', name: 'Nguyễn Văn Phúc', given: 'Phúc', initials: 'NP', role: 'tk', title: 'Trưởng khoa Cấp cứu', dept: 'Khoa Cấp cứu', code: 'NV0090', hue: 110 },
  { key: 'khang', name: 'Đỗ Minh Khang', given: 'Khang', initials: 'ĐK', role: 'dd', title: 'Điều dưỡng', dept: 'Khoa Ngoại', code: 'NV0266', hue: 190 },
  { key: 'viet', name: 'Trần Quốc Việt', given: 'Việt', initials: 'TV', role: 'tk', title: 'Trưởng khoa Ngoại', dept: 'Khoa Ngoại', code: 'NV0077', hue: 80 },
  { key: 'tram', name: 'Lý Ngọc Trâm', given: 'Trâm', initials: 'LT', role: 'dd', title: 'Kỹ thuật viên', dept: 'Khoa Xét nghiệm', code: 'NV0290', hue: 275 },
  { key: 'thu', name: 'Huỳnh Thị Thu', given: 'Thu', initials: 'HT', role: 'tk', title: 'Trưởng khoa Xét nghiệm', dept: 'Khoa Xét nghiệm', code: 'NV0083', hue: 40 },
  { key: 'mai', name: 'Hồ Thị Mai', given: 'Mai', initials: 'HM', role: 'dd', title: 'Điều dưỡng', dept: 'Khoa Nhi', code: 'NV0301', hue: 0 },
  { key: 'huy', name: 'Lâm Gia Huy', given: 'Huy', initials: 'LH', role: 'tk', title: 'Trưởng khoa Nhi', dept: 'Khoa Nhi', code: 'NV0094', hue: 130 },
  { key: 'anh', name: 'Trịnh Bảo Anh', given: 'Anh', initials: 'TA', role: 'dd', title: 'Điều dưỡng', dept: 'Khoa Sản', code: 'NV0322', hue: 320 },
  { key: 'linh', name: 'Châu Mỹ Linh', given: 'Linh', initials: 'CL', role: 'tk', title: 'Trưởng khoa Sản', dept: 'Khoa Sản', code: 'NV0101', hue: 15 }
]

const byKey = new Map(PEOPLE.map(p => [p.key, p]))

export function person(key: string): Person {
  return byKey.get(key) ?? { key, name: key, given: key, initials: '?', role: 'dd', title: '', code: '', hue: 0 }
}

/** Head of a department, who approves its slips at stage 1 */
export function headOf(khoa: string) {
  return PEOPLE.find(p => p.role === 'tk' && p.dept === khoa)!
}

export const DEMO_PEOPLE = PEOPLE.filter(p => p.demo)
