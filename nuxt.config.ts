// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: [
    "~/assets/app.scss",
    "@mdi/font/scss/materialdesignicons.scss",
    "vuetify/_styles.scss",
    "~/assets/roboto.scss",
  ],
  typescript: {
    shim: false,
  },
  build: {
    transpile: ["vuetify"],
  },
  experimental: {
    writeEarlyHints: false,
  },
  publicRuntimeConfig: {
    API_URL: "http://localhost:3001",
  },
  ssr: false,
});
