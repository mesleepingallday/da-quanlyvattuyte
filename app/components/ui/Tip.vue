<script setup lang="ts">
/** One-time inline tip (TipKit style). Dismissed tips stay dismissed on this device. */
const props = defineProps<{ id: string, icon: string, title: string }>()
const { tipSeen, dismissTip } = useSession()
const visible = computed(() => !tipSeen(props.id))
</script>

<template>
  <Transition leave-active-class="transition duration-200 ease-out" leave-to-class="opacity-0 -translate-y-1">
    <aside v-if="visible" class="flex items-start gap-3 rounded-group bg-default p-4 pe-2.5" :aria-label="title">
      <div class="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/12">
        <UIcon :name="icon" class="size-5 text-primary" aria-hidden="true" />
      </div>
      <div class="min-w-0 flex-1 pt-0.5">
        <p class="text-headline text-highlighted">
          {{ title }}
        </p>
        <p class="mt-0.5 text-callout text-muted">
          <slot />
        </p>
      </div>
      <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="sm" square aria-label="Ẩn mẹo này" class="-mt-1 text-muted" @click="dismissTip(id)" />
    </aside>
  </Transition>
</template>
