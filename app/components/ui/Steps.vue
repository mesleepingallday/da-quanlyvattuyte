<script setup lang="ts">
import type { Step } from '~/types'
import { ago } from '~/utils/format'
import { person } from '~/data/people'

/** Order-tracker style steps: vertical on phones, horizontal from `sm` up */
const props = defineProps<{ steps: Step[] }>()
const summary = computed(() => `Đã qua ${props.steps.filter(s => s.state === 'done').length} trên ${props.steps.length} bước`)
const cols = computed(() => ({ gridTemplateColumns: `repeat(${props.steps.length}, minmax(0, 1fr))` }))
const SR: Record<Step['state'], string> = { done: 'đã xong', current: 'đang chờ', rejected: 'bị từ chối', todo: 'chưa đến', skipped: 'không thực hiện' }
</script>

<template>
  <ol class="grid gap-0 sm:gap-2 max-sm:grid-cols-1!" :style="cols" :aria-label="summary">
    <li v-for="(s, i) in steps" :key="i" class="relative flex gap-3 pb-5 last:pb-0 sm:flex-col sm:gap-2.5 sm:pb-0">
      <span
        v-if="i < steps.length - 1"
        class="absolute top-7 bottom-0 left-[13px] w-0.5 rounded-full sm:top-[13px] sm:right-[-0.5rem] sm:bottom-auto sm:left-9 sm:h-0.5 sm:w-auto"
        :class="s.state === 'done' && (steps[i + 1]!.state === 'done' || steps[i + 1]!.state === 'current' || steps[i + 1]!.state === 'rejected') ? 'bg-(--mark-green)' : 'bg-(--fill-strong)'"
        aria-hidden="true"
      />
      <span
        class="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full"
        :class="{
          'bg-(--mark-green) text-white': s.state === 'done',
          'bg-(--mark-red) text-white': s.state === 'rejected',
          'bg-default ring-2 ring-(--mark-orange) ring-inset': s.state === 'current',
          'bg-(--fill)': s.state === 'todo' || s.state === 'skipped'
        }"
        aria-hidden="true"
      >
        <UIcon v-if="s.state === 'done'" name="i-lucide-check" class="size-4" />
        <UIcon v-else-if="s.state === 'rejected'" name="i-lucide-x" class="size-4" />
        <span v-else-if="s.state === 'current'" class="size-2.5 rounded-full bg-(--mark-orange)" />
      </span>
      <div class="min-w-0 pt-0.5 sm:pt-0">
        <p class="text-callout font-semibold" :class="s.state === 'todo' || s.state === 'skipped' ? 'text-muted' : s.state === 'rejected' ? 'text-error' : 'text-highlighted'">
          {{ s.label }}<span class="sr-only">, {{ SR[s.state] }}</span>
        </p>
        <p v-if="s.by && s.at" class="mt-0.5 text-footnote text-muted">
          {{ person(s.by).name }}<br class="hidden sm:block"><span class="sm:hidden">, </span>{{ ago(s.at) }}
        </p>
        <p v-else-if="s.state === 'current'" class="mt-0.5 text-footnote font-medium text-warning">
          Đang chờ
        </p>
      </div>
    </li>
  </ol>
</template>
