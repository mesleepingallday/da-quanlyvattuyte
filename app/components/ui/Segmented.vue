<script setup lang="ts" generic="T extends string">
/** Apple-style segmented control. Native radios underneath, so arrow keys and screen readers work. */
const props = defineProps<{
  options: { label: string, value: T, count?: number }[]
  label: string
  size?: 'sm' | 'md'
}>()
const model = defineModel<T>({ required: true })
const name = useId()
const index = computed(() => Math.max(0, props.options.findIndex(o => o.value === model.value)))
</script>

<template>
  <div
    role="radiogroup"
    :aria-label="label"
    class="relative grid rounded-full bg-(--fill) p-0.5"
    :style="{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }"
  >
    <span
      aria-hidden="true"
      class="absolute top-0.5 bottom-0.5 left-0.5 rounded-full bg-default shadow-raise transition-transform duration-300 ease-(--ease-ios) dark:bg-[#636366]"
      :style="{ width: `calc((100% - 4px) / ${options.length})`, transform: `translateX(${index * 100}%)` }"
    />
    <label
      v-for="o in options"
      :key="o.value"
      class="relative z-10 flex min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-full text-center font-semibold whitespace-nowrap transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary"
      :class="[size === 'sm' ? 'h-7 px-2.5 text-[13px]' : 'h-8 px-3 text-[14px]', model === o.value ? 'text-highlighted' : 'text-muted hover:text-default']"
    >
      <input v-model="model" type="radio" class="sr-only" :name="name" :value="o.value">
      <span class="truncate">{{ o.label }}</span>
      <span v-if="o.count" class="tabular text-[12px] font-semibold" :class="model === o.value ? 'text-muted' : 'text-dimmed'">{{ o.count }}</span>
    </label>
  </div>
</template>
