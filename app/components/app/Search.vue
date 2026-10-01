<script setup lang="ts">
import type { CommandPaletteGroup, CommandPaletteItem } from '@nuxt/ui'
import { item as getItem } from '~/data/catalog'
import { canSee, slipStatus } from '~/utils/slip'
import { fd, fold } from '~/utils/format'

/** Global search (Ctrl/⌘ K): slips, supplies, lots, places, actions. Accent-insensitive. */
const { user, role } = useSession()
const { slips, items, lots } = useStore()
const { items: nav, searchOpen, scanOpen } = useNav()
const colorMode = useColorMode()

defineShortcuts({ meta_k: () => { searchOpen.value = !searchOpen.value } })

const kw = (...parts: string[]) => fold(parts.join(' '))

const groups = computed<CommandPaletteGroup<CommandPaletteItem>[]>(() => {
  const actions: CommandPaletteItem[] = []
  if (role.value === 'dd') actions.push({ label: 'Lập phiếu lĩnh mới', icon: 'i-lucide-plus', to: '/lap-phieu', keywords: 'lap phieu linh moi' })
  if (role.value === 'kho') actions.push({ label: 'Quét mã lô', icon: 'i-lucide-scan-barcode', onSelect: () => { searchOpen.value = false; scanOpen.value = true }, keywords: 'quet ma lo scan' })
  actions.push({
    label: colorMode.value === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối',
    icon: colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon',
    onSelect: () => { colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark' },
    keywords: 'giao dien sang toi dark light'
  })

  return [
    {
      id: 'slips',
      label: 'Phiếu lĩnh',
      items: slips.value.filter(s => canSee(s, user.value)).slice(0, 60).map(s => ({
        label: s.so,
        suffix: `${s.khoa}, ${slipStatus(s).label.toLowerCase()}`,
        icon: 'i-lucide-clipboard-list',
        to: `/phieu/${s.so}`,
        keywords: kw(s.so, s.khoa, slipStatus(s).label)
      }))
    },
    {
      id: 'items',
      label: 'Vật tư',
      items: items.map(it => ({
        label: it.ten,
        suffix: it.ma,
        avatar: it.img ? { src: `/images/vat-tu/${it.img}-160.webp`, alt: '', ui: { root: 'rounded-lg bg-(--tile)' } } : undefined,
        to: `/kho/${it.ma}`,
        keywords: kw(it.ten, it.ma, it.nhom)
      }))
    },
    {
      id: 'lots',
      label: 'Số lô',
      items: lots.value.filter(l => l.sl > 0).map(l => ({
        label: `Lô ${l.so}`,
        suffix: `${getItem(l.ma).ten}, HSD ${fd(l.hsd)}`,
        icon: 'i-lucide-barcode',
        to: { path: `/kho/${l.ma}`, query: { lo: l.so } },
        keywords: kw(l.so, getItem(l.ma).ten)
      }))
    },
    { id: 'nav', label: 'Đi tới', items: nav.value.map(n => ({ label: n.label, icon: n.icon === 'today' ? 'i-lucide-calendar' : n.icon, to: n.to, keywords: fold(n.label) })) },
    { id: 'actions', label: 'Thao tác', items: actions }
  ]
})

function onSelect() {
  searchOpen.value = false
}
</script>

<template>
  <UModal
    v-model:open="searchOpen"
    title="Tìm kiếm"
    description="Tìm phiếu, vật tư, số lô hoặc thao tác"
    :ui="{ content: 'max-w-2xl sm:mt-[12vh] sm:mb-auto', header: 'sr-only', body: 'p-0 sm:p-0' }"
  >
    <template #body>
      <UCommandPalette
        :groups="groups"
        placeholder="Tìm phiếu, vật tư, số lô…"
        :fuse="{ fuseOptions: { keys: ['label', 'suffix', 'keywords'], ignoreDiacritics: true, threshold: 0.2 }, resultLimit: 8 }"
        close
        class="h-[min(70vh,560px)]"
        :ui="{ input: '[&_input]:text-[17px]' }"
        @update:model-value="onSelect"
        @update:open="searchOpen = $event"
      />
    </template>
  </UModal>
</template>
