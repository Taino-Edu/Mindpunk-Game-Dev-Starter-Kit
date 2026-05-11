export default defineNuxtConfig({
  devtools: { enabled: false },
  compatibilityDate: '2024-04-03',
  ssr: false,
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'ARCANE DUEL',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  }
})
