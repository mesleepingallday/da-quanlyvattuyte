<script setup lang="ts">
import type { RoleKey } from '~/types'
import { longDate, moneyShort } from '~/utils/format'

useHead({ title: 'Hôm nay' })

const { user, role } = useSession()
const { slipTasks, receiptTasks, following, recentlyIssued, count } = useTasks()
const { attention } = useInventory()
const { byDept, current } = useReports()
const { slips } = useStore()

const showStock = computed(() => role.value === 'kho' || role.value === 'vt')

/** The department's last issued slip, offered as "lĩnh lại" for routine restocking */
const repeatable = computed(() => slips.value.find(s => s.by === user.value?.key && s.stage === 5))

/** Head of department: what the department has drawn this month against last month */
const spend = computed(() => {
  const dept = user.value?.dept
  if (role.value !== 'tk' || !dept) return null
  const now = byDept(current).find(d => d.khoa === dept)!
  const prev = byDept('2026-08').find(d => d.khoa === dept)!
  const delta = prev.value ? (now.value - prev.value) / prev.value : 0
  return { now, prev, delta }
})

const TIPS: Record<RoleKey, { id: string, icon: string, title: string, text: string }> = {
  dd: { id: 'today-dd', icon: 'i-lucide-route', title: 'Thanh màu cho biết phiếu đã đi đến đâu', text: 'Mỗi vạch là một bước duyệt. Chạm vào phiếu để xem ai đang giữ phiếu và từ lúc nào.' },
  tk: { id: 'today-tk', icon: 'i-lucide-undo-2', title: 'Duyệt ngay trên danh sách', text: 'Lỡ tay thì bấm Hoàn tác trong thông báo hiện ra sau khi duyệt.' },
  kho: { id: 'today-kho', icon: 'i-lucide-scan-barcode', title: 'Quét tem lô trước khi lấy hàng', text: 'Ứng dụng báo ngay nếu còn lô khác hết hạn sớm hơn, hoặc lô đã hết hạn.' },
  vt: { id: 'today-vt', icon: 'i-lucide-undo-2', title: 'Duyệt ngay trên danh sách', text: 'Lỡ tay thì bấm Hoàn tác trong thông báo hiện ra sau khi duyệt.' },
  kt: { id: 'today-kt', icon: 'i-lucide-file-spreadsheet', title: 'Báo cáo mở được bằng Excel', text: 'Báo cáo xuất – nhập – tồn tải về dạng CSV có dấu tiếng Việt, mở thẳng bằng Excel.' }
}
const tip = computed(() => role.value ? TIPS[role.value] : null)
</script>

<template>
  <div v-if="user">
    <AppPageHeader title="Hôm nay" :subtitle="longDate()" width="1160px">
      <template #aside>
        <NuxtLink to="/tai-khoan" class="rounded-full lg:hidden" aria-label="Tài khoản và cài đặt">
          <UiAvatar :who="user" :size="36" />
        </NuxtLink>
      </template>
    </AppPageHeader>

    <div class="mx-auto grid max-w-[1160px] gap-8 px-4 pb-12 lg:px-8 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] xl:items-start">
      <div class="min-w-0 space-y-8">
        <UiTip v-if="tip" :id="tip.id" :icon="tip.icon" :title="tip.title">
          {{ tip.text }}
        </UiTip>

        <section v-if="role === 'dd'" class="overflow-hidden rounded-group bg-default" aria-label="Lập phiếu lĩnh">
          <div class="flex items-center gap-4 p-4">
            <div class="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/12">
              <UIcon name="i-lucide-square-pen" class="size-6 text-primary" aria-hidden="true" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-headline text-highlighted">
                Lập phiếu lĩnh
              </p>
              <p class="text-callout text-muted">
                {{ user.dept }}, lĩnh tại kho chính
              </p>
            </div>
            <UButton label="Lập phiếu" to="/lap-phieu" />
          </div>
          <UiRow v-if="repeatable" :to="{ path: '/lap-phieu', query: { tu: repeatable.so } }" chevron dense class="border-t border-(--hairline)">
            <template #leading>
              <UIcon name="i-lucide-repeat-2" class="size-5 text-primary" aria-hidden="true" />
            </template>
            <span class="text-[15px] font-medium text-primary">Lĩnh lại như {{ repeatable.so }}</span>
            <span v-if="repeatable.note" class="block truncate text-footnote text-muted">{{ repeatable.note }}</span>
          </UiRow>
        </section>

        <UiGroup title="Cần bạn xử lý" :count="count">
          <template v-if="count">
            <SlipRow v-for="s in slipTasks" :key="s.so" :slip="s" inline-action />
            <ReceiptRow v-for="r in receiptTasks" :key="r.so" :receipt="r" inline-action />
          </template>
          <UiEmpty v-else compact icon="i-lucide-check-check" title="Không có việc nào đang chờ bạn" description="Khi có phiếu cần bạn duyệt hoặc xử lý, phiếu sẽ hiện ở đây." />
          <template v-if="role === 'kho' && count" #footer>
            Theo quy trình, phiếu lĩnh được kho xác nhận ngay trong ngày nhận.
          </template>
        </UiGroup>

        <UiGroup v-if="following.length" title="Đang theo dõi" :count="following.length" :action="following.length > 4 ? { label: 'Xem tất cả', to: '/phieu?loc=dang-xu-ly' } : undefined">
          <SlipRow v-for="s in following.slice(0, 4)" :key="s.so" :slip="s" />
        </UiGroup>

        <UiGroup v-if="recentlyIssued.length" title="Vừa cấp phát" footer="Hàng đã cấp phát được giao về khoa; người nhận ký trên chứng từ xuất.">
          <SlipRow v-for="s in recentlyIssued" :key="s.so" :slip="s" />
        </UiGroup>
      </div>

      <div class="min-w-0 space-y-8">
        <UiGroup v-if="showStock" title="Lô cần chú ý" :count="attention.length" :action="{ label: 'Xem tất cả', to: '/kho?loc=chu-y' }">
          <ItemAttentionRow v-for="a in attention.slice(0, 5)" :key="a.kind + a.item.ma + (a.lot?.so ?? '')" :a="a" />
          <template #footer>
            Đỏ: hết hạn hoặc còn dưới 30 ngày. Cam: còn dưới 90 ngày hoặc dưới tồn tối thiểu.
          </template>
        </UiGroup>

        <UiGroup v-if="spend" :title="`${user.dept} tháng này`">
          <div class="p-4">
            <p class="text-footnote text-muted">
              Giá trị vật tư đã cấp phát
            </p>
            <p class="mt-1 text-title-2 text-highlighted tabular">
              {{ moneyShort(spend.now.value) }}
            </p>
            <p class="mt-1 inline-flex items-center gap-1 text-callout font-medium" :class="spend.delta > 0.1 ? 'text-warning' : 'text-muted'">
              <UIcon :name="spend.delta >= 0 ? 'i-lucide-trending-up' : 'i-lucide-trending-down'" class="size-4" aria-hidden="true" />
              {{ spend.delta >= 0 ? 'Tăng' : 'Giảm' }} {{ Math.abs(Math.round(spend.delta * 100)) }}% so với tháng 8 ({{ moneyShort(spend.prev.value) }})
            </p>
            <p class="mt-3 text-footnote text-muted tabular">
              {{ spend.now.slips }} phiếu đã cấp phát trong tháng
            </p>
          </div>
        </UiGroup>

        <UiGroup v-if="role === 'kt' || role === 'vt'" title="Báo cáo">
          <UiRow to="/bao-cao" chevron :inset="64">
            <template #leading>
              <div class="flex size-9 items-center justify-center rounded-xl bg-primary/12">
                <UIcon name="i-lucide-chart-column" class="size-5 text-primary" aria-hidden="true" />
              </div>
            </template>
            <div class="text-headline text-highlighted">
              Xuất – nhập – tồn tháng 9
            </div>
            <div class="text-callout text-muted">
              Số liệu đến hôm nay, tải về được
            </div>
          </UiRow>
          <UiRow :to="{ path: '/bao-cao', query: { xem: 'du-tru' } }" chevron :inset="64">
            <template #leading>
              <div class="flex size-9 items-center justify-center rounded-xl bg-primary/12">
                <UIcon name="i-lucide-calendar-days" class="size-5 text-primary" aria-hidden="true" />
              </div>
            </template>
            <div class="text-headline text-highlighted">
              Dự trù tháng 10
            </div>
            <div class="text-callout text-muted">
              Nhận từ 01/10 đến 05/10
            </div>
          </UiRow>
        </UiGroup>
      </div>
    </div>
  </div>
</template>
