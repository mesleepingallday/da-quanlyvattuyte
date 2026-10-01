<script setup lang="ts">
import type { Lot } from '~/types'
import { item as getItem } from '~/data/catalog'
import { daysUntil, fd, nf, place } from '~/utils/format'

/**
 * Scan a lot. Hand scanners type the code and press Enter, so a focused field is the scanner.
 * Accepts a lot number or a GS1 string; AI (10) carries the lot.
 */
const { scanOpen } = useNav()
const { lots } = useStore()
const code = ref('')
const query = ref('')

function parseCode(raw: string) {
  const s = raw.trim().toUpperCase().replace(/\s+/g, '')
  const bracket = s.match(/\(10\)([A-Z0-9-]+)/)
  if (bracket) return bracket[1]!
  const plain = s.match(/^01\d{14}(?:17\d{6})?10([A-Z0-9-]+)$/)
  if (plain) return plain[1]!
  return s
}

const lot = computed<Lot | undefined>(() => query.value ? lots.value.find(l => l.so === query.value) : undefined)
const it = computed(() => lot.value ? getItem(lot.value.ma) : undefined)
const days = computed(() => lot.value ? daysUntil(lot.value.hsd) : 0)
/** An issuable lot of the same item that expires sooner: FEFO says take that one first */
const earlier = computed(() => {
  const l = lot.value
  if (!l || l.q || days.value <= 0) return undefined
  return lots.value
    .filter(x => x.ma === l.ma && x.so !== l.so && !x.q && x.sl > 0 && daysUntil(x.hsd) > 0 && x.hsd < l.hsd)
    .sort((a, b) => a.hsd.localeCompare(b.hsd))[0]
})

function submit() {
  query.value = parseCode(code.value)
}
function sample(so: string) {
  code.value = so
  submit()
}
watch(scanOpen, (v) => { if (v) { code.value = ''; query.value = '' } })

function openItem() {
  if (!lot.value) return
  scanOpen.value = false
  navigateTo({ path: `/kho/${lot.value.ma}`, query: { lo: lot.value.so } })
}
</script>

<template>
  <UiSheet v-model:open="scanOpen" title="Quét mã lô" description="Dùng máy quét cầm tay hoặc gõ số lô in trên tem.">
    <div class="space-y-5">
      <div class="relative mx-auto flex h-36 max-w-sm items-center justify-center overflow-hidden rounded-3xl bg-[#111] [--scan-travel:6.25rem]" aria-hidden="true">
        <div class="absolute inset-5 rounded-2xl">
          <span class="absolute top-0 left-0 size-6 rounded-tl-xl border-t-[3px] border-l-[3px] border-white/90" />
          <span class="absolute top-0 right-0 size-6 rounded-tr-xl border-t-[3px] border-r-[3px] border-white/90" />
          <span class="absolute bottom-0 left-0 size-6 rounded-bl-xl border-b-[3px] border-l-[3px] border-white/90" />
          <span class="absolute right-0 bottom-0 size-6 rounded-br-xl border-r-[3px] border-b-[3px] border-white/90" />
          <span class="absolute inset-x-3 top-0 h-0.5 rounded-full bg-(--mark-green) shadow-[0_0_12px_2px_rgb(48_196_141/0.6)] motion-safe:animate-[scan-line_2.4s_var(--ease-ios)_infinite]" />
        </div>
        <UIcon name="i-lucide-barcode" class="size-14 text-white/25" />
      </div>

      <form class="flex gap-2" @submit.prevent="submit">
        <UInput
          v-model="code"
          autofocus
          icon="i-lucide-scan-line"
          placeholder="Số lô hoặc mã GS1"
          aria-label="Số lô hoặc mã GS1"
          class="flex-1"
          autocomplete="off"
          autocapitalize="characters"
          spellcheck="false"
        />
        <UButton type="submit" label="Tra cứu" :disabled="!code.trim()" />
      </form>

      <div v-if="!query" class="space-y-2">
        <p class="text-footnote text-muted">
          Thử với tem mẫu
        </p>
        <div class="flex flex-wrap gap-2">
          <UButton v-for="s in ['BT2402', 'GT2310', 'CN2403', 'KL2401']" :key="s" :label="s" color="neutral" variant="soft" size="sm" class="tabular" @click="sample(s)" />
        </div>
      </div>

      <div v-else-if="lot && it" class="space-y-3" aria-live="polite">
        <div class="flex items-center gap-4 rounded-2xl bg-(--fill)/60 p-3">
          <ItemThumb :item="it" :size="64" />
          <div class="min-w-0 flex-1">
            <p class="truncate text-headline text-highlighted">
              {{ it.ten }}
            </p>
            <p class="text-callout text-muted tabular">
              Lô {{ lot.so }}, HSD {{ fd(lot.hsd) }}
            </p>
            <div class="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
              <ItemShelf :days="days" :quarantined="lot.q" />
              <span class="text-footnote text-muted tabular">{{ nf(lot.sl) }} {{ it.dvt.toLowerCase() }}, {{ place(lot.viTri) }}</span>
            </div>
          </div>
        </div>

        <UAlert
          v-if="days <= 0"
          color="error"
          variant="subtle"
          icon="i-lucide-octagon-alert"
          title="Lô đã hết hạn, không được cấp phát"
          description="Để riêng lô này ở khu biệt trữ và báo P.VTTBYT lập biên bản hủy."
        />
        <UAlert
          v-else-if="lot.q"
          color="warning"
          variant="subtle"
          icon="i-lucide-archive-x"
          title="Lô đang biệt trữ"
          :description="lot.qLyDo"
        />
        <UAlert
          v-else-if="earlier"
          color="warning"
          variant="subtle"
          icon="i-lucide-hourglass"
          :title="`Lô ${earlier.so} hết hạn trước`"
          :description="`Theo FEFO, xuất lô ${earlier.so} (HSD ${fd(earlier.hsd)}, ${place(earlier.viTri)}) trước lô này.`"
        />
        <UAlert v-else color="success" variant="subtle" icon="i-lucide-circle-check" title="Lô này được xuất trước" description="Đây là lô hết hạn sớm nhất còn dùng được của vật tư này." />

        <UButton label="Xem vật tư" trailing-icon="i-lucide-chevron-right" color="neutral" variant="soft" block size="lg" @click="openItem" />
      </div>

      <UiEmpty
        v-else
        compact
        icon="i-lucide-search-x"
        :title="`Không thấy lô ${query}`"
        description="Kiểm tra lại số lô trên tem. Lô chưa nhập kho sẽ không có trong danh sách."
      />
    </div>
  </UiSheet>
</template>
