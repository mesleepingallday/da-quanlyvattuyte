<script setup lang="ts">
const props = withDefaults(defineProps<{ seed: string, height?: number }>(), { height: 40 })

const bars = computed(() => {
  let r = [...props.seed].reduce((a, c) => a * 31 + c.charCodeAt(0), 7)
  const out: { x: number, w: number }[] = []
  let w = 0
  while (w < 150) {
    r = (r * 1103515245 + 12345) & 0x7FFFFFFF
    const bw = 1 + (r >> 8) % 3
    const gap = 1 + (r >> 12) % 2
    out.push({ x: w, w: bw })
    w += bw + gap
  }
  return out
})
</script>

<template>
  <svg
    class="w-full fill-current"
    :viewBox="`0 0 150 ${height}`"
    preserveAspectRatio="none"
    aria-hidden="true"
    :style="{ height: `${height}px` }"
  >
    <rect
      v-for="b in bars"
      :key="b.x"
      :x="b.x"
      y="0"
      :width="b.w"
      :height="height"
    />
  </svg>
</template>
