<script setup lang="ts">
import { monthLabel, nf } from '~/utils/format'

/**
 * Monthly issued quantity, last months. Emphasis form: the current month in the accent,
 * the months before it in grey as context; a solid hairline marks the planning average.
 * Every value is reachable without hover through the table twin below.
 */
const props = defineProps<{ data: { month: string, xuat: number }[], dvt: string, avg: number }>()

const unit = computed(() => props.dvt.toLowerCase())
const top = computed(() => {
  const max = Math.max(props.avg, ...props.data.map(d => d.xuat))
  const raw = max / 4
  const mag = 10 ** Math.floor(Math.log10(raw))
  const step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => s >= raw)!
  return { max: step * 4, step }
})
const ticks = computed(() => [0, 1, 2, 3, 4].map(i => i * top.value.step))
const pct = (v: number) => `${(v / top.value.max) * 100}%`
const short = (ym: string) => `T${Number(ym.slice(5))}`
</script>

<template>
  <figure class="m-0">
    <figcaption class="sr-only">
      Lượng xuất {{ data.length }} tháng gần đây, đơn vị {{ unit }}
    </figcaption>
    <div class="flex gap-3">
      <!-- y ticks -->
      <div class="relative h-40 w-10 shrink-0 text-right text-caption text-muted tabular" aria-hidden="true">
        <span v-for="t in ticks" :key="t" class="absolute right-0 translate-y-1/2" :style="{ bottom: pct(t) }">{{ nf(t) }}</span>
      </div>
      <div class="min-w-0 flex-1">
        <div class="relative h-40">
          <!-- gridlines: solid hairlines, recessive -->
          <span v-for="t in ticks" :key="t" class="absolute inset-x-0 h-px bg-(--hairline)" :style="{ bottom: pct(t) }" aria-hidden="true" />
          <!-- planning average (named in the legend below, so it never collides with a value label) -->
          <span class="absolute inset-x-0 z-10 h-px bg-(--ui-text-muted)" :style="{ bottom: pct(avg) }" aria-hidden="true" />
          <div class="absolute inset-0 flex items-end justify-around">
            <UTooltip v-for="(d, i) in data" :key="d.month" :text="`${monthLabel(d.month)}: ${nf(d.xuat)} ${unit}`">
              <button
                type="button"
                class="group relative flex h-full w-10 items-end justify-center outline-none"
                :aria-label="`${monthLabel(d.month)}: ${nf(d.xuat)} ${unit}`"
              >
                <span
                  class="relative w-6 max-w-full rounded-t-[4px] transition-[filter] group-hover:brightness-110 group-focus-visible:ring-2 group-focus-visible:ring-primary group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-(--ui-bg)"
                  :class="i === data.length - 1 ? 'bg-(--chart-1)' : 'bg-(--chart-muted)'"
                  :style="{ height: pct(d.xuat) }"
                >
                  <span v-if="i === data.length - 1" class="absolute bottom-full left-1/2 -translate-x-1/2 pb-1 text-footnote font-semibold whitespace-nowrap text-highlighted tabular">{{ nf(d.xuat) }}</span>
                </span>
              </button>
            </UTooltip>
          </div>
        </div>
        <div class="mt-2 flex justify-around text-caption text-muted" aria-hidden="true">
          <span v-for="(d, i) in data" :key="d.month" class="w-10 text-center" :class="i === data.length - 1 && 'font-semibold text-highlighted'">{{ short(d.month) }}</span>
        </div>
      </div>
    </div>
    <div class="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-footnote text-muted">
      <span class="inline-flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-[3px] bg-(--chart-1)" aria-hidden="true" />{{ monthLabel(data[data.length - 1]!.month) }}</span>
      <span class="inline-flex items-center gap-1.5"><span class="h-px w-4 bg-(--ui-text-muted)" aria-hidden="true" />Trung bình dự trù {{ nf(avg) }} {{ unit }}/tháng</span>
    </div>
    <details class="group mt-3">
      <summary class="cursor-pointer list-none text-footnote font-medium text-primary [&::-webkit-details-marker]:hidden">
        <span class="group-open:hidden">Xem số liệu</span><span class="hidden group-open:inline">Ẩn số liệu</span>
      </summary>
      <table class="mt-2 w-full text-callout">
        <thead>
          <tr class="text-footnote text-muted">
            <th class="py-1 text-left font-medium">
              Tháng
            </th>
            <th class="py-1 text-right font-medium">
              Đã xuất ({{ unit }})
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in data" :key="d.month" class="border-t border-(--hairline)">
            <td class="py-1.5">
              {{ monthLabel(d.month) }}
            </td>
            <td class="py-1.5 text-right tabular">
              {{ nf(d.xuat) }}
            </td>
          </tr>
        </tbody>
      </table>
    </details>
  </figure>
</template>
