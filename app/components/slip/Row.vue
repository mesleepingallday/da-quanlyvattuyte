<script setup lang="ts">
import type { Slip } from '~/types'
import { ACTION_LABEL, myAction, slipStatus } from '~/utils/slip'
import { whenShort } from '~/utils/format'

/**
 * A slip in a list. The whole row opens the slip (stretched link); when it is the
 * viewer's turn, the action sits on the row so routine approvals take one tap.
 */
const props = defineProps<{ slip: Slip, selected?: boolean, inlineAction?: boolean, selectable?: boolean }>()
const checked = defineModel<boolean>('checked', { default: false })

const { user } = useSession()
const { run } = useSlipActions()
const action = computed(() => myAction(props.slip, user.value))
const status = computed(() => slipStatus(props.slip))
const mas = computed(() => props.slip.lines.map(l => l.ma))
</script>

<template>
  <div
    class="group/row relative flex min-w-0 items-center gap-3 px-4 py-3 transition-colors after:pointer-events-none after:absolute after:right-0 after:bottom-0 after:left-[86px] after:h-px after:bg-(--hairline) last:after:hidden has-[a:hover]:bg-(--fill)/50 has-[a:active]:bg-(--fill)"
    :class="selected && 'bg-primary/10 has-[a:hover]:bg-primary/12'"
  >
    <UCheckbox
      v-if="selectable"
      v-model="checked"
      class="relative z-10 -me-1"
      :aria-label="`Chọn ${slip.so}`"
    />
    <ItemThumbs :mas="mas" :size="44" />
    <div class="min-w-0 flex-1">
      <div class="flex items-baseline justify-between gap-3">
        <NuxtLink
          :to="`/phieu/${slip.so}`"
          class="truncate text-headline text-highlighted outline-none before:absolute before:inset-0 before:content-[''] focus-visible:before:ring-2 focus-visible:before:ring-primary focus-visible:before:ring-inset"
          :aria-current="selected ? 'page' : undefined"
        >
          {{ slip.khoa }}<span class="sr-only">, {{ slip.so }}, {{ status.label }}</span>
        </NuxtLink>
        <time class="shrink-0 text-footnote text-muted tabular" :datetime="slip.at">{{ whenShort(slip.at) }}</time>
      </div>
      <p class="truncate text-callout text-muted tabular">
        {{ slip.so }}, {{ slip.lines.length }} mặt hàng
      </p>
      <div class="mt-1.5 flex min-h-6 items-center justify-between gap-3">
        <div class="flex min-w-0 items-center gap-3">
          <UiStatus :status="status" class="shrink-0" />
          <!-- When it is the viewer's turn the button already says what is next -->
          <SlipProgress v-if="status.kind === 'waiting' && !(inlineAction && action)" :slip="slip" class="max-sm:hidden" />
        </div>
        <UButton
          v-if="inlineAction && action"
          :label="ACTION_LABEL[action]"
          size="sm"
          :color="action === 'fix' ? 'neutral' : 'primary'"
          :variant="action === 'fix' ? 'soft' : 'solid'"
          class="relative z-10 shrink-0"
          @click="run(action, slip)"
        />
      </div>
    </div>
  </div>
</template>
