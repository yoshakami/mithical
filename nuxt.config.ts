// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: [
    "~/assets/app.scss",
    "@mdi/font/scss/materialdesignicons.scss",
    "vuetify/_styles.scss",
    "~/assets/roboto.scss",
  ],
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "layout", mode: "out-in" },
  },
  typescript: {
    shim: false,
  },
  build: {
    transpile: ["vuetify"],
  },
  experimental: {
    writeEarlyHints: false,
  },
  runtimeConfig: {
    public: {
      API_URL: "http://localhost:3001",
    },
  },
  ssr: false,
});
