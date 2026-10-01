<script setup lang="ts">
import { TODAY } from '~/utils/format'

/** Calendar glyph showing today's date, drawn to match Lucide's 2px stroke */
const day = TODAY.getDate()
</script>

<template>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect x="3" y="4.5" width="18" height="16.5" rx="3.5" />
    <path d="M8 2.5v3.5M16 2.5v3.5M3 9.5h18" />
    <text x="12" y="18.4" text-anchor="middle" font-size="8.6" font-weight="700" fill="currentColor" stroke="none" style="font-family: inherit">{{ day }}</text>
  </svg>
</template>
