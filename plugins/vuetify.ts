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

const mithicalTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: "#000",
  },
};

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      themes: {
        wacca: waccaTheme,
        mithical: mithicalTheme,
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
