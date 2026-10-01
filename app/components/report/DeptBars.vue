<script setup lang="ts">
import { moneyShort, money, nf } from '~/utils/format'

/**
 * Issued value per department, largest first. One series, one hue; when `focus` names a
 * department (a head of department viewing), that bar keeps the accent and the rest go grey.
 * Bars are true percentages of the track; the track reserves room for the value at each tip,
 * so every value is labelled and there is no value axis.
 */
const props = defineProps<{ rows: { khoa: string, value: number, slips: number }[], focus?: string }>()
const max = computed(() => Math.max(1, ...props.rows.map(r => r.value)))
const pct = (v: number) => `${(v / max.value) * 100}%`
</script>

<template>
  <figure class="m-0">
    <figcaption class="sr-only">
      Giá trị vật tư đã cấp phát theo khoa
    </figcaption>
    <ul class="space-y-3">
      <li v-for="r in rows" :key="r.khoa" class="grid grid-cols-[7.5rem_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[9rem_minmax(0,1fr)]">
        <span class="truncate text-callout" :class="focus === r.khoa ? 'font-semibold text-highlighted' : 'text-default'">{{ r.khoa }}</span>
        <UTooltip :text="`${r.khoa}: ${money(r.value)}, ${nf(r.slips)} phiếu`">
          <button type="button" class="group block w-full pe-20 text-left outline-none" :aria-label="`${r.khoa}: ${money(r.value)}, ${r.slips} phiếu`">
            <span class="relative block h-5">
              <span
                class="absolute inset-y-0 left-0 rounded-e-[4px] transition-[filter] group-hover:brightness-110 group-focus-visible:ring-2 group-focus-visible:ring-primary group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-(--ui-bg)"
                :class="!focus || focus === r.khoa ? 'bg-(--chart-1)' : 'bg-(--chart-muted)'"
                :style="{ width: pct(r.value), minWidth: r.value ? '3px' : '0' }"
              />
              <span class="absolute top-1/2 -translate-y-1/2 ps-2 text-footnote font-semibold whitespace-nowrap text-highlighted tabular" :style="{ left: pct(r.value) }">{{ moneyShort(r.value) }}</span>
            </span>
          </button>
        </UTooltip>
      </li>
    </ul>
  </figure>
</template>
