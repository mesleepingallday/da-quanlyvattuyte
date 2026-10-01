<script setup lang="ts">
import { ITEMS, STORAGE } from '~/data/catalog'
import { canSee, slipStatus } from '~/utils/slip'
import { daysUntil, fd, money, nf, place, whenShort } from '~/utils/format'

definePageMeta({ task: true })

const route = useRoute()
const ma = computed(() => String(route.params.ma))
const it = computed(() => ITEMS.find(i => i.ma === ma.value))
const { stockOf } = useInventory()
const { usage } = useReports()
const { slips } = useStore()
const { user } = useSession()

const info = computed(() => it.value ? stockOf(ma.value) : undefined)
useHead({ title: () => it.value?.ten ?? 'Vật tư' })

const highlight = computed(() => typeof route.query.lo === 'string' ? route.query.lo : undefined)
const recent = computed(() => slips.value.filter(s => canSee(s, user.value) && s.lines.some(l => l.ma === ma.value)).slice(0, 5))
const firstUsable = computed(() => info.value?.nearest?.so)

function lotState(l: { q?: boolean, hsd: string, so: string }) {
  const d = daysUntil(l.hsd)
  if (l.q) return { label: 'Biệt trữ', icon: 'i-lucide-archive-x', cls: 'text-muted' }
  if (d <= 0) return { label: 'Hết hạn, không cấp phát', icon: 'i-lucide-octagon-alert', cls: 'text-error' }
  if (l.so === firstUsable.value) return { label: 'Xuất trước', icon: 'i-lucide-arrow-up-from-line', cls: 'text-primary' }
  return null
}
</script>

<template>
  <div v-if="it && info">
    <AppPageHeader :title="it.ten" :subtitle="`${it.ma}, ${it.nhom}`" back="/kho" back-label="Tồn kho" back-mobile-only width="880px" />

    <div class="mx-auto max-w-[880px] space-y-6 px-4 pb-16 lg:px-8">
      <section class="flex flex-col gap-6 rounded-group bg-default p-5 sm:flex-row sm:items-center">
        <ItemThumb :item="it" :size="200" :alt="it.ten" eager class="mx-auto shrink-0 sm:mx-0" />
        <div class="min-w-0 flex-1">
          <p class="text-footnote text-muted">
            Dùng được
          </p>
          <p class="mt-0.5">
            <span class="text-display text-highlighted">{{ nf(info.total) }}</span>
            <span class="ms-2 text-title-3 font-medium text-muted">{{ it.dvt.toLowerCase() }}</span>
          </p>
          <div class="mt-3 flex items-center gap-3">
            <span class="relative h-2 flex-1 rounded-full bg-(--fill)" aria-hidden="true">
              <span
                class="absolute inset-y-0 left-0 rounded-full"
                :class="info.total === 0 ? 'bg-(--mark-red)' : info.low ? 'bg-(--mark-orange)' : 'bg-(--mark-green)'"
                :style="{ width: `${Math.min(100, (info.total / Math.max(1, it.tonMin * 2)) * 100)}%` }"
              />
              <span class="absolute -top-1 -bottom-1 left-1/2 w-0.5 rounded-full bg-(--ui-text-dimmed)" />
            </span>
            <span class="text-footnote text-muted tabular">tối thiểu {{ nf(it.tonMin) }}</span>
          </div>
          <dl class="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
            <div>
              <dt class="text-footnote text-muted">
                Đủ dùng khoảng
              </dt>
              <dd class="text-headline tabular" :class="info.cover < 15 ? 'text-warning' : 'text-highlighted'">
                {{ Number.isFinite(info.cover) ? `${nf(info.cover)} ngày` : '—' }}
              </dd>
            </div>
            <div>
              <dt class="text-footnote text-muted">
                Chờ cấp phát
              </dt>
              <dd class="text-headline text-highlighted tabular">
                {{ nf(info.reserved) }} {{ it.dvt.toLowerCase() }}
              </dd>
            </div>
            <div v-if="info.quarantined">
              <dt class="text-footnote text-muted">
                Biệt trữ
              </dt>
              <dd class="text-headline text-highlighted tabular">
                {{ nf(info.quarantined) }} {{ it.dvt.toLowerCase() }}
              </dd>
            </div>
            <div v-if="info.expired">
              <dt class="text-footnote text-muted">
                Hết hạn, chờ hủy
              </dt>
              <dd class="text-headline text-error tabular">
                {{ nf(info.expired) }} {{ it.dvt.toLowerCase() }}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <UiGroup title="Lô hàng" :count="info.lots.length" footer="Xếp theo hạn dùng. Lô trên cùng còn dùng được là lô xuất trước (FEFO).">
        <div
          v-for="l in info.lots"
          :key="l.so"
          class="relative flex items-center gap-4 px-4 py-3.5 after:absolute after:right-0 after:bottom-0 after:left-4 after:h-px after:bg-(--hairline) last:after:hidden"
          :class="highlight === l.so && 'bg-primary/8'"
        >
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
              <p class="text-headline text-highlighted tabular">
                Lô {{ l.so }}
              </p>
              <span v-if="lotState(l)" class="inline-flex items-center gap-1 text-footnote font-semibold" :class="lotState(l)!.cls">
                <UIcon :name="lotState(l)!.icon" class="size-4" aria-hidden="true" />{{ lotState(l)!.label }}
              </span>
            </div>
            <div class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <ItemShelf :days="daysUntil(l.hsd)" :quarantined="l.q" />
              <span class="text-footnote text-muted tabular">HSD {{ fd(l.hsd) }}, {{ place(l.viTri) }}</span>
            </div>
            <p class="mt-1 truncate text-footnote text-muted">
              {{ l.q ? l.qLyDo : `Nhập ${fd(l.ngayNhap)} từ ${l.ncc.replace(/^Công ty (CP|TNHH)\s*/, '')}` }}
            </p>
          </div>
          <p class="shrink-0 text-right">
            <span class="text-title-3 tabular" :class="l.q || daysUntil(l.hsd) <= 0 ? 'text-muted line-through decoration-1' : 'text-highlighted'">{{ nf(l.sl) }}</span>
            <span class="block text-footnote text-muted">{{ it.dvt.toLowerCase() }}</span>
          </p>
        </div>
      </UiGroup>

      <UiGroup title="Lượng xuất 6 tháng">
        <div class="p-4 pt-6">
          <ItemUsageChart :data="usage(it.ma)" :dvt="it.dvt" :avg="it.dungTB" />
        </div>
      </UiGroup>

      <UiGroup title="Thông tin vật tư">
        <dl>
          <div v-for="row in [
            ['Quy cách', it.quyCach],
            ['Nhóm', it.nhom],
            ['Bảo quản', `${STORAGE[it.bq].label}, ${STORAGE[it.bq].range}`],
            ['Số đăng ký', it.soDk],
            ['Thanh toán', it.bhyt ? 'BHYT chi trả' : 'Thu phí, BHYT không chi trả'],
            ['Đơn giá', money(it.gia)],
            ['Vị trí trong kho', it.viTri]
          ]" :key="row[0]" class="relative flex items-baseline justify-between gap-4 px-4 py-3 after:absolute after:right-0 after:bottom-0 after:left-4 after:h-px after:bg-(--hairline) last:after:hidden">
            <dt class="shrink-0 text-[15px] text-muted">
              {{ row[0] }}
            </dt>
            <dd class="text-right text-[15px] text-highlighted tabular">
              {{ row[1] }}
            </dd>
          </div>
        </dl>
      </UiGroup>

      <UiGroup v-if="recent.length" title="Phiếu gần đây có vật tư này">
        <UiRow v-for="s in recent" :key="s.so" :to="`/phieu/${s.so}`" chevron dense>
          <div class="flex items-baseline justify-between gap-3">
            <span class="truncate text-[15px] font-semibold text-highlighted">{{ s.khoa }}</span>
            <span class="shrink-0 text-footnote text-muted tabular">{{ whenShort(s.at) }}</span>
          </div>
          <div class="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <span class="text-footnote text-muted tabular">{{ s.so }}, {{ nf(s.lines.find(l => l.ma === it!.ma)!.sl) }} {{ it.dvt.toLowerCase() }}</span>
            <UiStatus :status="slipStatus(s)" />
          </div>
        </UiRow>
      </UiGroup>
    </div>
  </div>

  <div v-else class="flex min-h-[60dvh] items-center justify-center">
    <UiEmpty icon="i-lucide-package-search" :title="`Không có vật tư ${ma}`" description="Mã vật tư không có trong danh mục.">
      <UButton label="Về tồn kho" to="/kho" color="neutral" variant="soft" />
    </UiEmpty>
  </div>
</template>
