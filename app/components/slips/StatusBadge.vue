<script setup lang="ts">
import type { PhieuStatus } from '~/types'
import { ST } from '~/data/sample'
import { STATUS_COLOR } from '~/utils/format'

defineProps<{ status: PhieuStatus }>()
</script>

<template>
  <UBadge :color="STATUS_COLOR[status]" variant="subtle">
    {{ ST[status] }}
  </UBadge>
</template>
