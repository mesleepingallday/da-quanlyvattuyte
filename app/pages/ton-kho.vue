<script setup lang="ts">
import { LO, VT } from '~/data/sample'

useHead({ title: 'Tồn kho theo lô' })
</script>

<template>
  <UDashboardPanel id="ton-kho">
    <template #header>
      <ShellAppNavbar title="Tồn kho theo lô" />
    </template>

    <template #body>
      <section>
        <div class="mb-3">
          <h2 class="text-base font-semibold text-highlighted">
            Tồn kho theo lô
          </h2>
          <p class="text-sm text-muted">
            {{ VT.length }} vật tư · {{ LO.length }} lô · lô biệt trữ không tính vào tổng
          </p>
        </div>
        <LotsTable />
      </section>
    </template>
  </UDashboardPanel>
</template>
