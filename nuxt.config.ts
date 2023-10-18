// https://v3.nuxtjs.org/api/configuration/nuxt.config
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

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
    keepalive: true,
  },

  build: {
    transpile: ["vuetify"],
  },

  runtimeConfig: {
    public: {
      apiUrl: "http://localhost:3001",
    },
  },

  ssr: false,

  devtools: {
    enabled: false,
  },

  vite: {
    plugins: [
      ViteImageOptimizer({
        /* pass your config */
      }),
    ],
  },
});
