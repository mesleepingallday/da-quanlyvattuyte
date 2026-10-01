// Nuxt UI theme overrides for v3. Palettes and the exact accent values live in main.css
// (CSS variables), so light and dark can differ. Variant classes beat slot classes in
// tailwind-variants, so overrides that compete with a default variant sit on that variant.
const field = 'text-highlighted bg-(--fill) ring-0 hover:bg-(--fill-strong) focus-visible:bg-default focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/70'

export default defineAppConfig({
  ui: {
    colors: {
      primary: 'duoc',
      secondary: 'duoc',
      success: 'duoc',
      info: 'sky',
      warning: 'orange',
      error: 'red',
      neutral: 'graphite'
    },
    button: {
      slots: {
        base: 'rounded-full font-semibold transition-[background-color,color,opacity,box-shadow,scale] active:scale-[0.97] motion-reduce:active:scale-100 disabled:opacity-40 aria-disabled:opacity-40 disabled:active:scale-100'
      },
      variants: {
        size: {
          xs: { base: 'px-2.5 py-1 text-xs/4 gap-1' },
          sm: { base: 'px-3 py-1.5 text-[13px]/5 gap-1.5' },
          md: { base: 'px-4 py-2.5 text-[15px]/5 gap-2' },
          lg: { base: 'px-5 py-3 text-[15px]/5 gap-2' },
          xl: { base: 'px-6 py-3.5 text-base/5 gap-2' }
        }
      },
      compoundVariants: [
        { size: 'sm', square: true, class: 'p-2' },
        { size: 'md', square: true, class: 'p-2.5' },
        { size: 'lg', square: true, class: 'p-3' },
        { size: 'xl', square: true, class: 'p-3' },
        { color: 'primary', variant: 'solid', class: 'bg-(--tint-fill) text-white hover:bg-(--tint-fill-hover) active:bg-(--tint-fill-hover) disabled:bg-(--tint-fill) aria-disabled:bg-(--tint-fill)' },
        { color: 'error', variant: 'solid', class: 'bg-(--danger-fill) text-white hover:bg-(--danger-fill-hover) active:bg-(--danger-fill-hover)' },
        { color: 'primary', variant: 'soft', class: 'bg-primary/12 hover:bg-primary/18 active:bg-primary/18' },
        { color: 'error', variant: 'soft', class: 'bg-error/10 hover:bg-error/15 active:bg-error/15' },
        { color: 'neutral', variant: 'soft', class: 'bg-(--fill) text-highlighted hover:bg-(--fill-strong) active:bg-(--fill-strong)' },
        { color: 'neutral', variant: 'ghost', class: 'text-highlighted hover:bg-(--fill) active:bg-(--fill)' },
        { color: 'neutral', variant: 'outline', class: 'ring-accented bg-default hover:bg-(--fill) active:bg-(--fill)' }
      ]
    },
    input: {
      variants: {
        variant: { outline: field },
        size: {
          md: { base: 'px-3.5 py-2.5 text-base/6 lg:text-[15px]/5 gap-2 rounded-xl', leading: 'ps-3', trailing: 'pe-3' },
          lg: { base: 'px-4 py-3 text-base/6 gap-2 rounded-xl', leading: 'ps-3.5', trailing: 'pe-3.5' }
        }
      }
    },
    textarea: {
      slots: { base: 'rounded-xl' },
      variants: {
        variant: { outline: field },
        size: { md: { base: 'px-3.5 py-2.5 text-base/6 lg:text-[15px]/6' } }
      }
    },
    select: {
      slots: { content: 'rounded-2xl shadow-float ring-0' },
      variants: {
        variant: { outline: field },
        size: { md: { base: 'px-3.5 py-2.5 text-base/6 lg:text-[15px]/5 rounded-xl', item: 'rounded-lg px-2.5 py-2 text-[15px]/5 lg:text-sm' } }
      }
    },
    selectMenu: {
      slots: { content: 'rounded-2xl shadow-float ring-0' },
      variants: {
        variant: { outline: field },
        size: { md: { base: 'px-3.5 py-2.5 text-base/6 lg:text-[15px]/5 rounded-xl', item: 'rounded-lg px-2.5 py-2 text-[15px]/5 lg:text-sm' } }
      }
    },
    inputNumber: {
      slots: { base: 'rounded-full text-center tabular-nums font-semibold' },
      variants: { variant: { outline: field } }
    },
    modal: {
      slots: {
        overlay: 'bg-black/30 dark:bg-black/60',
        header: 'px-6 pt-6 pb-0 sm:px-6 min-h-0 border-0',
        body: 'px-6 py-5 sm:px-6 sm:py-5',
        footer: 'px-6 pb-6 pt-0 sm:px-6 gap-2 justify-end',
        title: 'text-lg/6 font-semibold text-highlighted',
        description: 'mt-1 text-[15px]/5 text-muted',
        close: 'top-5 end-5'
      },
      variants: {
        fullscreen: { false: { content: 'w-[calc(100vw-2rem)] max-w-lg rounded-(--radius-sheet) shadow-float ring-0 divide-y-0' } },
        overlay: { true: { overlay: 'bg-black/30 dark:bg-black/60' } }
      }
    },
    drawer: {
      slots: {
        overlay: 'bg-black/30 dark:bg-black/60',
        content: 'bg-default ring-0 shadow-float',
        handle: '!bg-accented',
        container: 'p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] gap-5',
        title: 'text-lg/6 font-semibold text-highlighted',
        description: 'mt-1 text-[15px]/5 text-muted'
      },
      compoundVariants: [
        { direction: 'bottom', class: { content: 'rounded-t-(--radius-sheet) max-h-[92dvh]' } }
      ]
    },
    slideover: {
      slots: { content: 'ring-0 shadow-float', overlay: 'bg-black/20 dark:bg-black/50' }
    },
    popover: {
      slots: { content: 'rounded-2xl shadow-float ring-0 bg-default' }
    },
    dropdownMenu: {
      slots: {
        content: 'rounded-2xl shadow-float ring-0 bg-default min-w-56 p-1.5',
        separator: 'my-1.5 -mx-1.5'
      },
      variants: {
        size: { md: { item: 'rounded-lg px-2.5 py-2 text-[15px]/5 lg:text-sm gap-2.5', label: 'px-2.5 py-1.5 text-[13px] text-muted' } }
      }
    },
    tooltip: {
      slots: { content: 'rounded-lg bg-inverted text-inverted ring-0 shadow-float h-auto py-1.5 px-2.5 text-[13px]/4' }
    },
    toast: {
      slots: {
        root: 'rounded-2xl shadow-float ring-0 bg-default p-3.5 pe-3',
        title: 'text-[15px]/5 font-semibold text-highlighted',
        description: 'text-[13px]/5 text-muted',
        icon: 'size-6'
      }
    },
    commandPalette: {
      slots: {
        item: 'rounded-xl px-2.5 py-2 text-[15px]/5 lg:text-sm',
        label: 'px-2.5 py-1.5 text-[13px] font-semibold text-muted'
      }
    },
    // Alerts tint the surface instead of the page, so text keeps AA contrast wherever they sit
    alert: {
      slots: {
        root: 'rounded-2xl',
        title: 'text-[15px]/5 lg:text-sm font-semibold',
        description: 'opacity-100 text-[15px]/5 lg:text-sm'
      },
      compoundVariants: [
        { color: 'primary', variant: 'subtle', class: { root: 'bg-[color-mix(in_oklab,var(--ui-primary)_7%,var(--ui-bg))] ring-[color-mix(in_oklab,var(--ui-primary)_22%,transparent)]' } },
        { color: 'success', variant: 'subtle', class: { root: 'bg-[color-mix(in_oklab,var(--ui-success)_7%,var(--ui-bg))] ring-[color-mix(in_oklab,var(--ui-success)_22%,transparent)]' } },
        { color: 'info', variant: 'subtle', class: { root: 'bg-[color-mix(in_oklab,var(--ui-info)_7%,var(--ui-bg))] ring-[color-mix(in_oklab,var(--ui-info)_22%,transparent)]' } },
        { color: 'warning', variant: 'subtle', class: { root: 'bg-[color-mix(in_oklab,var(--ui-warning)_7%,var(--ui-bg))] ring-[color-mix(in_oklab,var(--ui-warning)_22%,transparent)]' } },
        { color: 'error', variant: 'subtle', class: { root: 'bg-[color-mix(in_oklab,var(--ui-error)_7%,var(--ui-bg))] ring-[color-mix(in_oklab,var(--ui-error)_22%,transparent)]' } },
        { color: 'neutral', variant: 'subtle', class: { root: 'bg-default text-default ring-(--hairline)' } }
      ]
    },
    kbd: {
      base: 'rounded-md font-sans normal-case'
    },
    badge: {
      slots: { base: 'rounded-full font-semibold' }
    }
  }
})
