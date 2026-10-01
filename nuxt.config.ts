export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@vueuse/nuxt'],
  ssr: false,
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  colorMode: { preference: 'system', fallback: 'light', storageKey: 'vtyt-color-mode' },
  fonts: {
    families: [
      { name: 'Be Vietnam Pro', provider: 'google', weights: [400, 500, 600, 700], subsets: ['vietnamese', 'latin', 'latin-ext'] }
    ]
  },
  app: {
    head: {
      htmlAttrs: { lang: 'vi' },
      title: 'Kho VTYT',
      titleTemplate: '%s · Kho VTYT',
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
      meta: [
        { name: 'description', content: 'Nhập, cấp phát và theo dõi vật tư y tế – Bệnh viện quận Phú Nhuận' },
        { name: 'theme-color', content: '#F5F5F7', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#000000', media: '(prefers-color-scheme: dark)' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-title', content: 'Kho VTYT' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.webmanifest' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  compatibilityDate: '2025-07-15'
})
