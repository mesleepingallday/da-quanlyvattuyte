<script setup lang="ts">
withDefaults(defineProps<{ seed: string, tag?: string, version?: string, code?: string, gtin?: string }>(), {
  tag: 'ĐANG CHUẨN BỊ',
  version: 'v2',
  code: 'SẮP CÓ',
  gtin: '(01) 00000000000000'
})
</script>

<template>
  <div class="w-65 rounded-lg border border-dashed border-accented bg-elevated/40 px-4 py-3.5 text-left">
    <div class="mb-2 flex justify-between font-mono text-xs font-medium tracking-wider text-muted">
      <span>{{ tag }}</span><b class="font-semibold">{{ version }}</b>
    </div>
    <Barcode :seed="seed" :height="40" class="text-highlighted opacity-60" />
    <div class="mt-1.5 mb-2 text-center font-mono text-xs tracking-widest text-muted">
      {{ gtin }}
    </div>
    <div class="text-center font-mono text-lg font-semibold leading-none text-highlighted">
      {{ code }}
    </div>
  </div>
</template>
