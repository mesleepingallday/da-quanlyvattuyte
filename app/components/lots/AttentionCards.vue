<script setup lang="ts">
import type { Lo, VatTu } from '~/types'
import { LO, VT } from '~/data/sample'
import { days, fd, nf, pd } from '~/utils/format'

type Tab = 'hsd' | 'min'
const tab = ref<Tab>('hsd')
const showAll = ref(false)

const tabs = [
  { label: 'Sắp hết hạn', value: 'hsd' },
  { label: 'Dưới tồn tối thiểu', value: 'min' }
]

interface Card {
  v: VatTu
  l: Lo
  d: number
  t?: number
  ratio?: number
}

const totalLot = (ma: string) => LO.filter(l => l.ma === ma && !l.q).reduce((a, l) => a + l.sl, 0)
const fefo = (ma: string) => LO.filter(l => l.ma === ma && !l.q).sort((a, b) => a.hsd < b.hsd ? -1 : 1)[0]!

const cards = computed<Card[]>(() => {
  if (tab.value === 'hsd') {
    return LO.filter(l => !l.q)
      .map(l => ({ l, v: VT.find(v => v.ma === l.ma)!, d: days(pd(l.hsd)) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 5)
  }
  return VT.map((v) => {
    const t = totalLot(v.ma)
    const l = fefo(v.ma)
    return { v, l, t, ratio: t / v.tonMin, d: days(pd(l.hsd)) }
  }).sort((a, b) => a.ratio - b.ratio).slice(0, 5)
})

function sev(c: Card) {
  const level = tab.value === 'hsd'
    ? (c.d < 30 ? 0 : c.d < 90 ? 1 : 2)
    : (c.ratio! < 1 ? 0 : c.ratio! < 2 ? 1 : 2)
  return [
    { color: 'error' as const, label: 'Nghiêm trọng', icon: 'i-lucide-triangle-alert', text: 'text-error' },
    { color: 'warning' as const, label: 'Cảnh báo', icon: 'i-lucide-clock', text: 'text-warning' },
    { color: 'info' as const, label: 'Theo dõi', icon: 'i-lucide-eye', text: 'text-info' }
  ][level]!
}

function summary(c: Card) {
  return tab.value === 'hsd' ? `còn ${c.d} ngày` : `tồn ${nf(c.t!)} trên tối thiểu ${nf(c.v.tonMin)}`
}
</script>

<template>
  <section>
    <div class="mb-3 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 class="text-base font-semibold text-highlighted">
          Lô cần chú ý
        </h2>
        <p class="text-sm text-muted">
          Xếp theo FEFO · cập nhật 30/09/2026
        </p>
      </div>
      <UTabs v-model="tab" :items="tabs" :content="false" variant="pill" size="sm" color="neutral" />
    </div>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-6">
      <UPageCard
        v-for="(c, i) in cards"
        :key="tab + c.l.so"
        to="/ton-kho"
        variant="outline"
        :aria-label="`${sev(c).label}: ${c.v.ten}, ${summary(c)}, lô ${c.l.so}`"
        :class="[
          sev(c).color === 'error' ? 'sm:col-span-3 border-error/40 bg-error/5' : 'sm:col-span-2',
          i >= 3 && !showAll && 'hidden sm:block'
        ]"
        :ui="{ container: 'p-4 sm:p-4' }"
      >
        <div class="flex min-w-0 flex-col gap-2">
          <div class="flex items-start justify-between gap-2">
            <span class="whitespace-nowrap font-mono font-semibold tabular-nums leading-none" :class="[sev(c).text, sev(c).color === 'error' ? 'text-3xl' : 'text-2xl']">
              <template v-if="tab === 'hsd'">{{ Math.max(c.d, 0) }}<small class="ml-2 text-xs font-medium tracking-wider">NGÀY</small></template>
              <template v-else>{{ nf(c.t!) }} / {{ nf(c.v.tonMin) }}<small class="ml-2 text-xs font-medium tracking-wider">{{ c.v.dvt.toUpperCase() }}</small></template>
            </span>
            <UBadge :color="sev(c).color" variant="subtle" :icon="sev(c).icon" :label="sev(c).label" />
          </div>
          <div class="truncate font-medium text-highlighted">
            {{ c.v.ten }}
          </div>
          <div class="text-sm text-muted">
            HSD {{ fd(pd(c.l.hsd)) }} · Lô <span class="font-mono">{{ c.l.so }}</span>
          </div>
          <Barcode :seed="c.l.so + c.v.ma" :height="16" class="mt-1 text-highlighted opacity-40" />
        </div>
      </UPageCard>
    </div>

    <UButton
      class="mt-2 sm:hidden"
      block
      color="neutral"
      variant="outline"
      :label="showAll ? 'Thu gọn' : 'Xem tất cả ' + cards.length + ' lô'"
      @click="showAll = !showAll"
    />
  </section>
</template>
