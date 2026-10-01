<script setup lang="ts">
import type { RoleKey } from '~/types'

definePageMeta({ layout: 'auth' })
useHead({ title: 'Chào mừng' })

const { user, finishOnboarding, signOut } = useSession()

interface Feature { icon: string, title: string, text: string }

/** Three things each role will do here, in their words */
const FEATURES: Record<RoleKey, Feature[]> = {
  dd: [
    { icon: 'i-lucide-square-pen', title: 'Lập phiếu lĩnh trong một phút', text: 'Chọn vật tư theo hình, thấy ngay kho còn bao nhiêu khi nhập số lượng.' },
    { icon: 'i-lucide-route', title: 'Biết phiếu đang ở đâu', text: 'Mỗi phiếu cho thấy đã qua mấy bước và ai đang duyệt.' },
    { icon: 'i-lucide-repeat-2', title: 'Lĩnh lại phiếu thường dùng', text: 'Lặp lại cơ số tủ trực của tuần trước chỉ bằng một lần chạm.' }
  ],
  tk: [
    { icon: 'i-lucide-check-check', title: 'Duyệt ngay trên danh sách', text: 'Phiếu của khoa chờ bạn hiện ở màn Hôm nay, kèm nút Duyệt.' },
    { icon: 'i-lucide-undo-2', title: 'Lỡ tay thì hoàn tác', text: 'Sau khi duyệt, bạn có vài giây để hoàn tác ngay trong thông báo.' },
    { icon: 'i-lucide-chart-column', title: 'Theo dõi chi phí của khoa', text: 'Giá trị vật tư khoa đã lĩnh trong tháng, so với tháng trước.' }
  ],
  kho: [
    { icon: 'i-lucide-list-checks', title: 'Việc trong ngày ở một chỗ', text: 'Phiếu chờ xác nhận, chờ cấp phát và hàng đang kiểm nhập.' },
    { icon: 'i-lucide-scan-barcode', title: 'Cấp phát đúng lô', text: 'Ứng dụng chọn lô hết hạn trước; quét tem lô để xác nhận khi lấy hàng.' },
    { icon: 'i-lucide-hourglass', title: 'Biết sớm lô sắp hết hạn', text: 'Lô còn dưới 90 ngày được đánh dấu để ưu tiên xuất.' }
  ],
  vt: [
    { icon: 'i-lucide-check-check', title: 'Duyệt nhanh, có hoàn tác', text: 'Duyệt từng phiếu hoặc nhiều phiếu cùng lúc; lỡ tay thì hoàn tác.' },
    { icon: 'i-lucide-file-signature', title: 'Ký phiếu nhập kho', text: 'Xem kết quả kiểm nhập và đối chiếu giá trước khi ký.' },
    { icon: 'i-lucide-octagon-alert', title: 'Xử lý lô hết hạn', text: 'Lô hết hạn bị chặn cấp phát và hiện ở đầu danh sách để lập biên bản hủy.' }
  ],
  kt: [
    { icon: 'i-lucide-receipt-text', title: 'Đối chiếu hóa đơn với hợp đồng', text: 'Dòng có giá lệch hợp đồng được đánh dấu ngay trên phiếu nhập.' },
    { icon: 'i-lucide-file-spreadsheet', title: 'Báo cáo xuất – nhập – tồn', text: 'Chọn tháng, xem tổng hợp và tải về để mở bằng Excel.' },
    { icon: 'i-lucide-git-branch', title: 'Truy vết từng lô', text: 'Biết lô nào nhập từ đâu và đã xuất cho khoa nào.' }
  ]
}

const features = computed(() => user.value ? FEATURES[user.value.role] : [])

/** Supplies in a loose arc: the one orchestrated moment of the app */
const HERO = [
  { ma: 'VT002', size: 76, x: 0, y: 34, r: -8 },
  { ma: 'VT001', size: 88, x: 17, y: 4, r: -3 },
  { ma: 'VT004', size: 104, x: 50, y: 0, r: 0 },
  { ma: 'VT007', size: 88, x: 83, y: 4, r: 3 },
  { ma: 'VT010', size: 76, x: 100, y: 34, r: 8 }
]

function start() {
  finishOnboarding()
  navigateTo('/')
}
function switchUser() {
  signOut()
  navigateTo('/dang-nhap')
}
</script>

<template>
  <div v-if="user" class="w-full max-w-[460px]">
    <div class="relative mx-auto h-36 w-full max-w-[360px]" aria-hidden="true">
      <ItemThumb
        v-for="(h, i) in HERO"
        :key="h.ma"
        :item="h.ma"
        :size="h.size"
        card
        eager
        class="absolute animate-settle"
        :style="{
          left: `calc(${h.x}% - ${h.size * h.x / 100}px)`,
          top: `${h.y}px`,
          rotate: `${h.r}deg`,
          zIndex: 10 - Math.abs(2 - i),
          animationDelay: `${120 + Math.abs(2 - i) * 90}ms`
        }"
      />
    </div>

    <h1 class="mt-8 text-center text-title-2 text-highlighted sm:text-title">
      Xin chào, {{ user.given }}
    </h1>
    <p class="mx-auto mt-2 max-w-sm text-center text-[15px]/6 text-muted">
      {{ user.title }}{{ user.role === 'dd' && user.dept ? `, ${user.dept}` : '' }}. Đây là những việc ứng dụng giúp bạn làm nhanh hơn.
    </p>

    <ul class="mt-9 space-y-6">
      <li v-for="f in features" :key="f.title" class="flex gap-4">
        <div class="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/12">
          <UIcon :name="f.icon" class="size-6 text-primary" aria-hidden="true" />
        </div>
        <div class="min-w-0 pt-0.5">
          <p class="text-headline text-highlighted">
            {{ f.title }}
          </p>
          <p class="mt-0.5 text-callout text-muted">
            {{ f.text }}
          </p>
        </div>
      </li>
    </ul>

    <div v-if="user.dept" class="mt-9">
      <div class="flex items-center gap-4 rounded-group bg-default px-4 py-3.5">
        <UIcon name="i-lucide-building-2" class="size-6 shrink-0 text-muted" aria-hidden="true" />
        <div class="min-w-0 flex-1">
          <p class="text-footnote text-muted">
            Khoa của bạn
          </p>
          <p class="text-headline text-highlighted">
            {{ user.dept }}
          </p>
        </div>
      </div>
      <p class="mt-2 px-4 text-footnote text-muted">
        Phiếu lĩnh của bạn sẽ ghi tên khoa này. Cần đổi khoa, liên hệ P.VTTBYT.
      </p>
    </div>

    <UButton label="Bắt đầu" block size="xl" class="mt-9" @click="start" />
    <UButton label="Không phải bạn? Đổi tài khoản" color="neutral" variant="link" block class="mt-2 text-muted" @click="switchUser" />
  </div>
</template>
