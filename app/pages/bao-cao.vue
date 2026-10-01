<script setup lang="ts">
import { downloadTable } from '~/utils/csv'
import { money, moneyShort, monthLabel, nf } from '~/utils/format'

useHead({ title: 'Báo cáo' })

type View = 'xnt' | 'khoa' | 'du-tru'
const route = useRoute()
const { role, user } = useSession()
const { months, current, xnt, byDept, forecast } = useReports()
const toast = useToast()

const views = computed(() => {
  const all = [
    { label: 'Xuất – nhập – tồn', value: 'xnt' as View },
    { label: 'Theo khoa', value: 'khoa' as View },
    { label: 'Dự trù', value: 'du-tru' as View }
  ]
  return role.value === 'tk' ? all.filter(v => v.value === 'khoa') : all
})
const view = ref<View>((route.query.xem === 'du-tru' ? 'du-tru' : role.value === 'tk' ? 'khoa' : 'xnt'))

/* ---------- Month ---------- */
const month = ref(current)
const monthItems = computed(() => [...months].reverse().map(m => ({ label: monthLabel(m), value: m })))
const mi = computed(() => months.indexOf(month.value))
const step = (d: number) => { month.value = months[Math.min(months.length - 1, Math.max(0, mi.value + d))]! }
const historyStart = '2026-07'

/* ---------- Xuất – nhập – tồn ---------- */
const rows = computed(() => xnt(month.value))
const totals = computed(() => rows.value.reduce((a, r) => ({
  dau: a.dau + r.dau * r.item.gia,
  nhap: a.nhap + r.nhap * r.item.gia,
  xuat: a.xuat + r.xuat * r.item.gia,
  cuoi: a.cuoi + r.cuoi * r.item.gia
}), { dau: 0, nhap: 0, xuat: 0, cuoi: 0 }))

function exportXnt() {
  downloadTable(`bao-cao-xuat-nhap-ton-${month.value}.csv`, [
    [`Báo cáo xuất – nhập – tồn ${monthLabel(month.value).toLowerCase()}`, 'Kho chính, Bệnh viện quận Phú Nhuận'],
    [],
    ['Mã', 'Tên vật tư', 'ĐVT', 'Tồn đầu', 'Nhập', 'Xuất', 'Tồn cuối', 'Đơn giá', 'Giá trị tồn cuối'],
    ...rows.value.map(r => [r.item.ma, r.item.ten, r.item.dvt, r.dau, r.nhap, r.xuat, r.cuoi, r.item.gia, r.cuoi * r.item.gia]),
    ['', 'Tổng giá trị', '', Math.round(totals.value.dau), Math.round(totals.value.nhap), Math.round(totals.value.xuat), Math.round(totals.value.cuoi), '', Math.round(totals.value.cuoi)]
  ])
  toast.add({ title: 'Đã tải báo cáo về máy', description: 'Mở tệp bằng Excel; tiếng Việt và các cột giữ nguyên.', icon: 'i-lucide-file-spreadsheet', color: 'success' })
}

/* ---------- Theo khoa ---------- */
const deptMonth = computed(() => month.value < historyStart ? historyStart : month.value)
const depts = computed(() => byDept(deptMonth.value))
const deptTotal = computed(() => depts.value.reduce((a, d) => a + d.value, 0))
const focus = computed(() => role.value === 'tk' ? user.value?.dept : undefined)

/* ---------- Dự trù ---------- */
const plan = ref(forecast().map(f => ({ ...f, sl: f.goiY })))
const planValue = computed(() => plan.value.reduce((a, p) => a + p.sl * p.item.gia, 0))
function sendPlan() {
  toast.add({ title: 'Đã gửi dự trù tháng 10', description: `${plan.value.filter(p => p.sl > 0).length} mặt hàng, ${moneyShort(planValue.value)}. P.VTTBYT sẽ tổng hợp từ ngày 01/10.`, icon: 'i-lucide-circle-check', color: 'success' })
}
</script>

<template>
  <div>
    <AppPageHeader title="Báo cáo" subtitle="Kho chính, số liệu cập nhật đến 30/09/2026" width="1100px">
      <template #below>
        <div class="mt-4 flex flex-wrap items-center gap-3">
          <UiSegmented v-if="views.length > 1" v-model="view" :options="views" label="Chọn báo cáo" class="w-full sm:w-auto sm:min-w-[440px]" />
          <div v-if="view !== 'du-tru'" class="flex items-center gap-1">
            <UButton icon="i-lucide-chevron-left" color="neutral" variant="ghost" square aria-label="Tháng trước" :disabled="mi === 0" @click="step(-1)" />
            <USelect v-model="month" :items="monthItems" aria-label="Chọn tháng" class="w-44" />
            <UButton icon="i-lucide-chevron-right" color="neutral" variant="ghost" square aria-label="Tháng sau" :disabled="mi === months.length - 1" @click="step(1)" />
          </div>
        </div>
      </template>
    </AppPageHeader>

    <div class="mx-auto max-w-[1100px] space-y-6 px-4 pb-16 lg:px-8">
      <!-- Xuất – nhập – tồn -->
      <template v-if="view === 'xnt'">
        <section class="grid grid-cols-2 overflow-hidden rounded-group bg-default lg:grid-cols-4" aria-label="Tổng giá trị trong tháng">
          <div v-for="(t, i) in [['Tồn đầu kỳ', totals.dau], ['Nhập trong tháng', totals.nhap], ['Xuất trong tháng', totals.xuat], ['Tồn cuối kỳ', totals.cuoi]] as [string, number][]" :key="t[0]" class="border-(--hairline) p-4" :class="[i % 2 === 1 && 'border-l', i >= 2 && 'border-t lg:border-t-0', i === 2 && 'lg:border-l']">
            <p class="text-footnote text-muted">
              {{ t[0] }}
            </p>
            <p class="mt-1 text-title-3 text-highlighted">
              {{ moneyShort(t[1]) }}
            </p>
          </div>
        </section>

        <UiGroup :title="`Chi tiết ${monthLabel(month).toLowerCase()}`">
          <template #action>
            <UButton label="Tải về Excel" icon="i-lucide-download" color="neutral" variant="soft" size="sm" @click="exportXnt" />
          </template>
          <div class="overflow-x-auto">
            <table class="w-full min-w-[720px] text-[15px] lg:text-sm">
              <thead>
                <tr class="text-left text-footnote text-muted">
                  <th class="sticky left-0 bg-default py-3 ps-4 pe-3 font-medium">
                    Vật tư
                  </th>
                  <th class="px-3 py-3 text-right font-medium">
                    Tồn đầu
                  </th>
                  <th class="px-3 py-3 text-right font-medium">
                    Nhập
                  </th>
                  <th class="px-3 py-3 text-right font-medium">
                    Xuất
                  </th>
                  <th class="px-3 py-3 text-right font-medium">
                    Tồn cuối
                  </th>
                  <th class="py-3 ps-3 pe-4 text-right font-medium">
                    Giá trị tồn
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in rows" :key="r.item.ma" class="border-t border-(--hairline)">
                  <th scope="row" class="sticky left-0 bg-default py-2.5 ps-4 pe-3 text-left font-normal">
                    <NuxtLink :to="`/kho/${r.item.ma}`" class="flex items-center gap-3 rounded-lg">
                      <ItemThumb :item="r.item" :size="36" />
                      <span class="min-w-0">
                        <span class="block truncate font-medium text-highlighted">{{ r.item.ten }}</span>
                        <span class="block text-footnote text-muted">{{ r.item.ma }}, {{ r.item.dvt.toLowerCase() }}</span>
                      </span>
                    </NuxtLink>
                  </th>
                  <td class="px-3 text-right text-default tabular">
                    {{ nf(r.dau) }}
                  </td>
                  <td class="px-3 text-right tabular" :class="r.nhap ? 'text-default' : 'text-dimmed'">
                    {{ r.nhap ? nf(r.nhap) : '–' }}
                  </td>
                  <td class="px-3 text-right text-default tabular">
                    {{ nf(r.xuat) }}
                  </td>
                  <td class="px-3 text-right font-semibold text-highlighted tabular">
                    {{ nf(r.cuoi) }}
                  </td>
                  <td class="ps-3 pe-4 text-right text-default tabular">
                    {{ money(r.cuoi * r.item.gia) }}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="border-t border-(--hairline) bg-(--fill)/40">
                  <th scope="row" class="sticky left-0 bg-[color-mix(in_oklab,var(--ui-bg),var(--fill-strong)_25%)] py-3 ps-4 pe-3 text-left font-semibold text-highlighted">
                    Tổng giá trị
                  </th>
                  <td class="px-3 text-right text-default tabular">
                    {{ moneyShort(totals.dau) }}
                  </td>
                  <td class="px-3 text-right text-default tabular">
                    {{ moneyShort(totals.nhap) }}
                  </td>
                  <td class="px-3 text-right text-default tabular">
                    {{ moneyShort(totals.xuat) }}
                  </td>
                  <td class="px-3 text-right text-default tabular" />
                  <td class="ps-3 pe-4 text-right font-semibold text-highlighted tabular">
                    {{ money(totals.cuoi) }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <template #footer>
            Tồn tính cả lô biệt trữ và lô hết hạn chờ hủy, vì hàng vẫn nằm trong kho. Số lượng theo đơn vị tính của từng vật tư.
          </template>
        </UiGroup>
      </template>

      <!-- Theo khoa -->
      <template v-else-if="view === 'khoa'">
        <UiGroup :title="`Giá trị cấp phát ${monthLabel(deptMonth).toLowerCase()}`" :footer="month < historyStart ? 'Dữ liệu phiếu theo khoa bắt đầu từ tháng 7/2026.' : 'Tính theo giá trị lô đã phát trên các phiếu đã cấp phát trong tháng.'">
          <div class="p-4 pt-5">
            <p class="mb-4 text-callout text-muted">
              Tổng <span class="font-semibold text-highlighted">{{ money(deptTotal) }}</span>, {{ nf(depts.reduce((a, d) => a + d.slips, 0)) }} phiếu
            </p>
            <ReportDeptBars :rows="depts" :focus="focus" />
          </div>
        </UiGroup>
        <UiGroup title="Số liệu">
          <table class="w-full text-[15px] lg:text-sm">
            <thead>
              <tr class="text-left text-footnote text-muted">
                <th class="py-3 ps-4 pe-3 font-medium">
                  Khoa
                </th>
                <th class="px-3 py-3 text-right font-medium">
                  Số phiếu
                </th>
                <th class="py-3 ps-3 pe-4 text-right font-medium">
                  Giá trị
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="d in depts" :key="d.khoa" class="border-t border-(--hairline)" :class="focus === d.khoa && 'bg-primary/6'">
                <th scope="row" class="py-2.5 ps-4 pe-3 text-left font-medium text-highlighted">
                  {{ d.khoa }}
                </th>
                <td class="px-3 text-right tabular">
                  {{ nf(d.slips) }}
                </td>
                <td class="ps-3 pe-4 text-right tabular">
                  {{ money(d.value) }}
                </td>
              </tr>
            </tbody>
          </table>
        </UiGroup>
      </template>

      <!-- Dự trù -->
      <template v-else>
        <UAlert
          color="info"
          variant="subtle"
          icon="i-lucide-calendar-days"
          title="Dự trù tháng 10 nhận từ 01/10 đến 05/10"
          description="Số gợi ý = lượng xuất trung bình 3 tháng gần nhất × 1,2 − tồn cuối tháng 9 (theo QĐ 651). Sửa số trước khi gửi nếu khoa có kế hoạch riêng."
        />
        <UiGroup title="Đề xuất cho tháng 10">
          <div class="overflow-x-auto">
            <table class="w-full min-w-[640px] text-[15px] lg:text-sm">
              <thead>
                <tr class="text-left text-footnote text-muted">
                  <th class="py-3 ps-4 pe-3 font-medium">
                    Vật tư
                  </th>
                  <th class="px-3 py-3 text-right font-medium">
                    Xuất TB/tháng
                  </th>
                  <th class="px-3 py-3 text-right font-medium">
                    Tồn cuối T9
                  </th>
                  <th class="px-3 py-3 text-right font-medium">
                    Gợi ý
                  </th>
                  <th class="py-3 ps-3 pe-4 text-right font-medium">
                    Dự trù
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in plan" :key="p.item.ma" class="border-t border-(--hairline)">
                  <th scope="row" class="py-2.5 ps-4 pe-3 text-left font-normal">
                    <span class="flex items-center gap-3">
                      <ItemThumb :item="p.item" :size="36" />
                      <span class="min-w-0">
                        <span class="block truncate font-medium text-highlighted">{{ p.item.ten }}</span>
                        <span class="block text-footnote text-muted">{{ p.item.dvt.toLowerCase() }}</span>
                      </span>
                    </span>
                  </th>
                  <td class="px-3 text-right tabular">
                    {{ nf(p.avg) }}
                  </td>
                  <td class="px-3 text-right tabular">
                    {{ nf(p.cuoi) }}
                  </td>
                  <td class="px-3 text-right tabular" :class="p.goiY ? 'text-default' : 'text-dimmed'">
                    {{ p.goiY ? nf(p.goiY) : 'Không cần' }}
                  </td>
                  <td class="py-2 ps-3 pe-4 text-right">
                    <UInputNumber v-model="p.sl" :min="0" :step="p.avg >= 500 ? 100 : p.avg >= 50 ? 10 : 1" size="sm" class="ms-auto w-32" :aria-label="`Số dự trù ${p.item.ten}`" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </UiGroup>
        <div class="flex flex-wrap items-center justify-end gap-3">
          <p class="me-auto text-callout text-muted">
            {{ plan.filter(p => p.sl > 0).length }} mặt hàng, ước tính <span class="font-semibold text-highlighted tabular">{{ money(planValue) }}</span>
          </p>
          <UButton label="Tải về Excel" icon="i-lucide-download" color="neutral" variant="soft" @click="downloadTable('du-tru-thang-10-2026.csv', [['Mã', 'Tên vật tư', 'ĐVT', 'Xuất TB/tháng', 'Tồn cuối T9', 'Gợi ý', 'Dự trù'], ...plan.map(p => [p.item.ma, p.item.ten, p.item.dvt, p.avg, p.cuoi, p.goiY, p.sl])])" />
          <UButton label="Gửi dự trù" icon="i-lucide-send" @click="sendPlan" />
        </div>
      </template>
    </div>
  </div>
</template>
