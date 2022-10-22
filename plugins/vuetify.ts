// plugins/vuetify.js
import { createVuetify, ThemeDefinition } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const waccaTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: "#e50065",
  },
};

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      themes: {
        wacca: waccaTheme,
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
