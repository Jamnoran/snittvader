import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      OPENCAGE_API_KEY: process.env.OPENCAGE_API_KEY
    }
  }
})
