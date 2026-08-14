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
    keepalive: true,
  },

  build: {
    transpile: ["vuetify"],
  },

  runtimeConfig: {
    public: {
      apiUrl: process.env.MITHICAL_BACKEND_URL || "http://localhost:3001",
    },
  },

  ssr: false,

  compatibilityDate: "2024-09-23",

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler", // or "modern"
        },
      },
    },
    plugins: [
      {
        name: "wacca-songs-reload",
        handleHotUpdate({ file, server }) {
          const normalized = file.replace(/\\/g, "/");
          if (normalized.includes("/assets/wacca/waccaSongs.js")) {
            server.ws.send({ type: "full-reload" });
            return [];
          }
        },
      },
    ],
  },
});
