<script setup lang="ts">
import type { TableColumn, TableRow } from '@nuxt/ui'
import type { TableMeta } from '@tanstack/vue-table'
import type { Lo, VatTu } from '~/types'
import { LO, LOC, VT } from '~/data/sample'
import { days, fd, nf, pd, toneClass } from '~/utils/format'

interface Row {
  id: string
  vt: VatTu
  lot?: Lo
  total?: number
  low?: boolean
  children?: Row[]
}

const q = ref('')
const expanded = ref<Record<string, boolean>>({ VT002: true, VT006: true, VT004: true })

const totalLot = (ma: string) => LO.filter(l => l.ma === ma && !l.q).reduce((a, l) => a + l.sl, 0)

const data = computed<Row[]>(() => {
  const term = q.value.trim().toLowerCase()
  return VT
    .filter(v => !term || (v.ten + v.ma + LO.filter(l => l.ma === v.ma).map(l => l.so).join(' ')).toLowerCase().includes(term))
    .map((v) => {
      const total = totalLot(v.ma)
      return {
        id: v.ma,
        vt: v,
        total,
        low: total < v.tonMin,
        children: LO.filter(l => l.ma === v.ma)
          .sort((a, b) => a.hsd < b.hsd ? -1 : 1)
          .map(l => ({ id: v.ma + '/' + l.so, vt: v, lot: l }))
      }
    })
})

function lotState(l: Lo): { label: string, color: 'neutral' | 'error' | 'warning' | 'info' } {
  const d = days(pd(l.hsd))
  if (l.q) return { label: 'Biệt trữ', color: 'info' }
  if (d < 30) return { label: 'Cận hạn', color: 'error' }
  if (d < 90) return { label: 'Sắp hết hạn', color: 'warning' }
  return { label: 'Bình thường', color: 'neutral' }
}

const right = { class: { th: 'text-right', td: 'text-right' } }
const columns: TableColumn<Row>[] = [
  { id: 'name', header: 'Vật tư / Lô' },
  { id: 'loc', header: 'Vị trí / BQ', meta: { class: { th: 'hidden sm:table-cell', td: 'hidden sm:table-cell' } } },
  { id: 'hsd', header: 'HSD', meta: { class: { th: 'hidden md:table-cell', td: 'hidden md:table-cell' } } },
  { id: 'left', header: 'Thời hạn', meta: { class: { th: 'hidden md:table-cell', td: 'hidden md:table-cell' } } },
  { id: 'st', header: 'Trạng thái' },
  { id: 'qty', header: 'Số lượng', meta: right }
]

const meta: TableMeta<Row> = {
  class: { tr: row => row.original.lot ? '' : 'bg-elevated/50 font-medium cursor-pointer' }
}

function onSelect(_e: Event, row: TableRow<Row>) {
  if (!row.original.lot) row.toggleExpanded()
}
</script>

<template>
  <div>
    <div class="mb-3">
      <UInput
        v-model="q"
        icon="i-lucide-search"
        placeholder="Tìm vật tư hoặc số lô"
        aria-label="Tìm tồn kho"
        class="w-full sm:w-80"
      />
    </div>

    <div class="overflow-hidden rounded-lg border border-default">
      <UTable
        v-model:expanded="expanded"
        :data="data"
        :columns="columns"
        :get-sub-rows="(r: Row) => r.children"
        :get-row-id="(r: Row) => r.id"
        :meta="meta"
        :ui="{ th: 'py-2.5', td: 'py-2.5', tbody: '[&>tr[data-slot=tr]:not([data-expanded])]:hidden' }"
        @select="onSelect"
      >
        <template #empty>
          Không tìm thấy vật tư.
        </template>

        <template #name-cell="{ row }">
          <div v-if="!row.original.lot" class="flex items-center gap-2">
            <UIcon
              name="i-lucide-chevron-right"
              class="size-4 shrink-0 text-muted transition-transform"
              :class="row.getIsExpanded() && 'rotate-90'"
            />
            <UIcon name="i-lucide-package" class="size-4 shrink-0 text-muted" />
            <span class="text-highlighted">{{ row.original.vt.ten }}</span>
            <span class="font-mono text-xs font-normal text-muted">· {{ row.original.vt.ma }}</span>
          </div>
          <div v-else class="pl-12">
            <span class="font-mono text-sm text-highlighted">{{ row.original.lot.so }}</span>
          </div>
        </template>

        <template #loc-cell="{ row }">
          <span v-if="!row.original.lot" class="text-muted">{{ row.original.vt.bq }}</span>
          <span v-else class="font-mono text-muted">{{ LOC[row.original.vt.ma] }}</span>
        </template>

        <template #hsd-cell="{ row }">
          <span v-if="!row.original.lot" class="text-muted">{{ row.original.vt.nhom }}</span>
          <span v-else class="font-mono tabular-nums">{{ fd(pd(row.original.lot.hsd)) }}</span>
        </template>

        <template #left-cell="{ row }">
          <span
            v-if="row.original.lot"
            class="font-mono tabular-nums"
            :class="row.original.lot.q ? 'text-muted' : toneClass(days(pd(row.original.lot.hsd)))"
          >còn {{ days(pd(row.original.lot.hsd)) }} ngày</span>
        </template>

        <template #st-cell="{ row }">
          <UBadge
            v-if="row.original.lot"
            :color="lotState(row.original.lot).color"
            variant="subtle"
            :label="lotState(row.original.lot).label"
          />
          <UBadge
            v-else
            :color="row.original.low ? 'error' : 'success'"
            variant="subtle"
            :label="row.original.low ? 'Dưới tối thiểu' : 'Đủ hàng'"
          />
        </template>

        <template #qty-cell="{ row }">
          <template v-if="!row.original.lot">
            <b class="font-mono tabular-nums">{{ nf(row.original.total!) }}</b>
            <span class="ml-1 text-xs font-normal text-muted">{{ row.original.vt.dvt }}</span>
          </template>
          <span
            v-else
            class="font-mono tabular-nums"
            :class="row.original.lot.q && 'text-dimmed line-through'"
            :title="row.original.lot.q ? 'Không tính vào tổng tồn' : undefined"
          >{{ nf(row.original.lot.sl) }}</span>
        </template>
      </UTable>
    </div>

    <p class="mt-3 text-sm text-muted">
      Lô được xếp theo FEFO: hết hạn trước, xuất trước.
    </p>
  </div>
</template>
