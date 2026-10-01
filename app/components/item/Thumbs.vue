<script setup lang="ts">
/** What is in a slip at a glance: the first product, with a second tile peeking behind when there are more. */
const props = withDefaults(defineProps<{ mas: string[], size?: number }>(), { size: 44 })
const shown = computed(() => props.mas.slice(0, 2))
const off = computed(() => ({ x: Math.round(props.size * 0.28), y: Math.round(props.size * 0.16) }))
</script>

<template>
  <div
    class="relative shrink-0"
    :style="{ width: `${size + (shown.length > 1 ? off.x : 0)}px`, height: `${size + (shown.length > 1 ? off.y : 0)}px` }"
    aria-hidden="true"
  >
    <ItemThumb
      v-for="(ma, i) in shown"
      :key="ma"
      :item="ma"
      :size="size"
      class="absolute ring-2 ring-(--ui-bg)"
      :style="{ left: `${i * off.x}px`, top: `${i * off.y}px`, zIndex: 2 - i }"
    />
  </div>
</template>
