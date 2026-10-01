<script setup lang="ts">
import type { Slip, SlipEvent, Step } from '~/types'
import { STEPS } from '~/utils/slip'

/**
 * Where a slip is in its five steps. `compact` is the thin capsule used in lists;
 * `full` names each step with who did it and when (like an order tracker).
 */
const props = withDefaults(defineProps<{ slip: Slip, variant?: 'compact' | 'full' }>(), { variant: 'compact' })

const STEP_EVENT: SlipEvent['kind'][] = ['gui', 'duyet-khoa', 'xac-nhan', 'duyet', 'cap-phat']

const steps = computed<Step[]>(() => {
  const s = props.slip
  return STEPS.map((step, i) => {
    let state: Step['state']
    if (s.rejected) state = i < s.rejected.stage ? 'done' : i === s.rejected.stage ? 'rejected' : 'skipped'
    else if (s.stage === 0) state = i === 0 ? 'current' : 'todo'
    else state = i < s.stage ? 'done' : i === s.stage ? 'current' : 'todo'
    const ev = state === 'rejected'
      ? s.events.find(e => e.kind === 'tu-choi')
      : state === 'done' ? [...s.events].reverse().find(e => e.kind === STEP_EVENT[i]) : undefined
    return { label: state === 'rejected' ? 'Từ chối' : step.label, state, by: ev?.by, at: ev?.at }
  })
})

const segClass: Record<Step['state'], string> = {
  done: 'bg-(--mark-green)',
  current: 'bg-(--mark-orange)',
  rejected: 'bg-(--mark-red)',
  todo: 'bg-(--fill-strong)',
  skipped: 'bg-(--fill)'
}
const summary = computed(() => `Đã qua ${steps.value.filter(s => s.state === 'done').length} trên ${steps.value.length} bước`)
</script>

<template>
  <div v-if="variant === 'compact'" class="flex w-20 shrink-0 gap-0.5" role="img" :aria-label="summary">
    <span v-for="(s, i) in steps" :key="i" class="h-1 flex-1 rounded-full" :class="segClass[s.state]" />
  </div>
  <UiSteps v-else :steps="steps" />
</template>
