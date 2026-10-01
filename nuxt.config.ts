export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@vueuse/nuxt'],
  ssr: false,
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  colorMode: { preference: 'dark', fallback: 'dark' },
  fonts: {
    families: [
      { name: 'Be Vietnam Pro', provider: 'google', weights: [400, 500, 600, 700], subsets: ['vietnamese', 'latin', 'latin-ext'] },
      { name: 'IBM Plex Mono', provider: 'google', weights: [400, 500, 600], subsets: ['vietnamese', 'latin', 'latin-ext'] }
    ]
  },
  app: {
    head: {
      htmlAttrs: { lang: 'vi' },
      title: 'Kho VTYT · Bệnh viện quận Phú Nhuận',
      titleTemplate: '%s · Kho VTYT'
    }
  },
  compatibilityDate: '2025-07-15'
})
