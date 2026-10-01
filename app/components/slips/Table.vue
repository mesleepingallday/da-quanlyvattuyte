<script setup lang="ts">
import type { TableColumn, TableRow } from '@nuxt/ui'
import type { TableMeta } from '@tanstack/vue-table'
import type { Phieu, PhieuStatus } from '~/types'
import { P, ST } from '~/data/sample'
import { fd, money } from '~/utils/format'

interface Row {
  id: string
  group?: boolean
  khoa: string
  slip?: Phieu
  count?: number
  value: number
  children?: Row[]
}
type SortKey = 'no' | 'date' | 'items' | 'value'

const emit = defineEmits<{ open: [n: number] }>()

const { slips, bulkApprove } = useSlips()
const toast = useToast()

const q = ref('')
const filter = defineModel<'all' | PhieuStatus>('filter', { default: 'all' })
const page = ref(1)
const per = 10
const sort = ref<{ k: SortKey, d: 1 | -1 }>({ k: 'date', d: -1 })
const sel = ref<number[]>([])
const collapsed = ref<string[]>([])

const filtered = computed(() => {
  const term = q.value.trim().toLowerCase()
  const { k, d } = sort.value
  return slips.value
    .filter(s => (filter.value === 'all' || s.st === filter.value)
      && (!term || (s.no + ' ' + s.khoa + ' ' + ST[s.st] + ' ' + fd(s.date)).toLowerCase().includes(term)))
    .sort((x, y) => {
      const v = k === 'date' ? (x.date.getTime() - y.date.getTime() || x.n - y.n)
        : k === 'value' ? x.value - y.value
          : k === 'items' ? x.items.length - y.items.length
            : x.n - y.n
      return v * d
    })
})

const pages = computed(() => Math.max(1, Math.ceil(filtered.value.length / per)))
watch([q, filter], () => { page.value = 1 })
watch(pages, (n) => { if (page.value > n) page.value = n })

const pageSlips = computed(() => filtered.value.slice((page.value - 1) * per, page.value * per))

const data = computed<Row[]>(() => {
  const groups: Row[] = []
  for (const s of pageSlips.value) {
    let g = groups.find(x => x.khoa === s.khoa)
    if (!g) {
      g = { id: 'g:' + s.khoa, group: true, khoa: s.khoa, count: 0, value: 0, children: [] }
      groups.push(g)
    }
    g.children!.push({ id: String(s.n), khoa: s.khoa, slip: s, value: s.value })
    g.count!++
    g.value += s.value
  }
  return groups
})

const expanded = computed<Record<string, boolean>>({
  get: () => Object.fromEntries(data.value.filter(g => !collapsed.value.includes(g.id)).map(g => [g.id, true])),
  set: (v) => {
    const next = new Set(collapsed.value)
    for (const g of data.value) {
      if (v[g.id]) next.delete(g.id)
      else next.add(g.id)
    }
    collapsed.value = [...next]
  }
})

function toggleAll() {
  // like the prototype: if anything is collapsed, expand all; else collapse all
  collapsed.value = collapsed.value.length ? [] : filtered.value.map(s => 'g:' + s.khoa)
}

const from = computed(() => filtered.value.length ? (page.value - 1) * per + 1 : 0)
const to = computed(() => Math.min(page.value * per, filtered.value.length))

function setSort(k: SortKey) {
  sort.value = sort.value.k === k ? { k, d: sort.value.d === 1 ? -1 : 1 } : { k, d: -1 }
}
function sortIcon(k: SortKey) {
  return sort.value.k !== k ? 'i-lucide-chevrons-up-down' : sort.value.d === 1 ? 'i-lucide-arrow-up' : 'i-lucide-arrow-down'
}

// selection
const isSel = (n: number) => sel.value.includes(n)
function toggleOne(n: number, v: boolean | 'indeterminate') {
  sel.value = v ? [...new Set([...sel.value, n])] : sel.value.filter(x => x !== n)
}
function groupIds(g: Row) { return (g.children ?? []).map(c => c.slip!.n) }
function groupState(g: Row): boolean | 'indeterminate' {
  const ids = groupIds(g)
  const n = ids.filter(isSel).length
  return n === 0 ? false : n === ids.length ? true : 'indeterminate'
}
function toggleGroup(g: Row, v: boolean | 'indeterminate') {
  const ids = groupIds(g)
  sel.value = v ? [...new Set([...sel.value, ...ids])] : sel.value.filter(x => !ids.includes(x))
}

function onSelect(_e: Event, row: TableRow<Row>) {
  if (row.original.group) row.toggleExpanded()
  else emit('open', row.original.slip!.n)
}

const columns: TableColumn<Row>[] = [
  { id: 'name', header: 'Số phiếu / Khoa' },
  { id: 'date', header: 'Ngày lập', meta: { class: { th: 'hidden md:table-cell', td: 'hidden md:table-cell' } } },
  { id: 'appr', header: 'Người duyệt', meta: { class: { th: 'hidden lg:table-cell', td: 'hidden lg:table-cell' } } },
  { id: 'st', header: 'Trạng thái' },
  { id: 'items', header: 'Mặt hàng', meta: { class: { th: 'text-right hidden sm:table-cell', td: 'text-right hidden sm:table-cell' } } },
  { id: 'value', header: 'Giá trị', meta: { class: { th: 'text-right', td: 'text-right' } } }
]

const meta = computed<TableMeta<Row>>(() => ({
  class: {
    tr: (row) => {
      if (row.original.group) return 'bg-elevated/50 font-medium cursor-pointer'
      return isSel(row.original.slip!.n) ? 'bg-primary/10 cursor-pointer' : 'cursor-pointer'
    }
  }
}))

const APPROVERS: Record<PhieuStatus, (keyof typeof P)[]> = {
  N: [], W: ['binh', 'hung'], A: ['binh', 'hung', 'hanh'], D: ['binh', 'hung', 'hanh'], R: ['binh', 'hung']
}

function doBulkApprove() {
  const c = bulkApprove(sel.value)
  sel.value = []
  toast.add({
    title: c ? 'Đã duyệt ' + c + ' phiếu' : 'Không có phiếu chờ duyệt trong lựa chọn',
    icon: c ? 'i-lucide-check' : 'i-lucide-info',
    color: c ? 'success' : 'neutral'
  })
}
function doExport() {
  toast.add({ title: 'Đã xuất Excel (' + sel.value.length + ' phiếu)', icon: 'i-lucide-check', color: 'success' })
}
</script>

<template>
  <div>
    <div class="mb-3 flex flex-wrap items-center gap-2">
      <UInput
        v-model="q"
        icon="i-lucide-search"
        placeholder="Tìm số phiếu, khoa, trạng thái"
        aria-label="Tìm phiếu"
        class="w-full sm:w-80"
      />
      <span class="flex-1" />
      <UButton icon="i-lucide-list" color="neutral" variant="outline" label="Thu/mở nhóm" @click="toggleAll" />
      <UButton
        icon="i-lucide-plus"
        label="Lập phiếu lĩnh"
        @click="toast.add({ title: 'Đã tạo nháp phiếu lĩnh mới', icon: 'i-lucide-check', color: 'success' })"
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
          Không có phiếu nào khớp bộ lọc.
        </template>

        <template #name-header>
          <UButton
            label="Số phiếu / Khoa"
            color="neutral"
            variant="link"
            size="sm"
            :trailing-icon="sortIcon('no')"
            class="-mx-1 p-1 font-medium"
            @click="setSort('no')"
          />
        </template>
        <template #date-header>
          <UButton label="Ngày lập" color="neutral" variant="link" size="sm" :trailing-icon="sortIcon('date')" class="-mx-1 p-1 font-medium" @click="setSort('date')" />
        </template>
        <template #items-header>
          <UButton label="Mặt hàng" color="neutral" variant="link" size="sm" :trailing-icon="sortIcon('items')" class="-mx-1 p-1 font-medium" @click="setSort('items')" />
        </template>
        <template #value-header>
          <UButton label="Giá trị" color="neutral" variant="link" size="sm" :trailing-icon="sortIcon('value')" class="-mx-1 p-1 font-medium" @click="setSort('value')" />
        </template>

        <template #name-cell="{ row }">
          <div v-if="row.original.group" class="flex items-center gap-2">
            <UIcon
              name="i-lucide-chevron-right"
              class="size-4 shrink-0 text-muted transition-transform"
              :class="row.getIsExpanded() && 'rotate-90'"
            />
            <UCheckbox
              :model-value="groupState(row.original)"
              :aria-label="`Chọn cả ${row.original.khoa}`"
              @click.stop
              @update:model-value="toggleGroup(row.original, $event)"
            />
            <UIcon name="i-lucide-map-pin" class="size-4 shrink-0 text-muted" />
            <span class="text-highlighted">{{ row.original.khoa }}</span>
            <span class="text-muted font-normal">· {{ row.original.count }} phiếu</span>
          </div>
          <div v-else class="flex items-center gap-2 pl-6">
            <UCheckbox
              :model-value="isSel(row.original.slip!.n)"
              :aria-label="`Chọn ${row.original.slip!.no}`"
              @click.stop
              @update:model-value="toggleOne(row.original.slip!.n, $event)"
            />
            <span class="font-mono tabular-nums text-highlighted">{{ row.original.slip!.no }}</span>
          </div>
        </template>
        <template #date-cell="{ row }">
          <span v-if="row.original.slip" class="font-mono tabular-nums">{{ fd(row.original.slip.date) }}</span>
        </template>
        <template #appr-cell="{ row }">
          <template v-if="row.original.slip">
            <UAvatarGroup v-if="APPROVERS[row.original.slip.st].length" size="xs">
              <UAvatar
                v-for="k in APPROVERS[row.original.slip.st]"
                :key="k"
                :text="P[k].i"
                :alt="`${P[k].n} · ${P[k].r}`"
                :title="`${P[k].n} · ${P[k].r}`"
                :style="{ backgroundColor: P[k].c, color: '#0E0F11' }"
                :ui="{ fallback: 'text-[#0E0F11] font-semibold' }"
              />
            </UAvatarGroup>
            <span v-else class="text-dimmed">—</span>
          </template>
        </template>
        <template #st-cell="{ row }">
          <SlipsStatusBadge v-if="row.original.slip" :status="row.original.slip.st" />
        </template>
        <template #items-cell="{ row }">
          <span v-if="row.original.slip" class="font-mono tabular-nums">{{ row.original.slip.items.length }}</span>
        </template>
        <template #value-cell="{ row }">
          <span class="font-mono tabular-nums" :class="row.original.group && 'text-highlighted'">{{ money(row.original.value) }}</span>
        </template>
      </UTable>
    </div>

    <div class="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
      <span>Hiển thị <b class="font-mono tabular-nums text-default">{{ from }}–{{ to }}</b> trên <b class="font-mono tabular-nums text-default">{{ filtered.length }}</b> phiếu</span>
      <UPagination v-model:page="page" :total="filtered.length" :items-per-page="per" :sibling-count="1" show-edges />
    </div>

    <div
      v-if="sel.length"
      role="region"
      aria-label="Thao tác hàng loạt"
      class="fixed bottom-8 left-1/2 z-40 flex max-w-[calc(100%-1.5rem)] -translate-x-1/2 flex-wrap items-center gap-2 rounded-lg border border-accented bg-elevated p-2 pl-4 font-medium shadow-2xl"
    >
      <span>{{ sel.length }} phiếu đã chọn</span>
      <USeparator orientation="vertical" class="h-5" />
      <UButton size="sm" label="Duyệt" @click="doBulkApprove" />
      <UButton size="sm" color="neutral" variant="outline" label="Xuất Excel" @click="doExport" />
      <UButton size="sm" color="neutral" variant="ghost" label="Bỏ chọn" @click="sel = []" />
    </div>
  </div>
</template>
