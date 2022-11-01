<template>
  <v-app>
    <MainNav />
    <NuxtLayout :name="layout"> </NuxtLayout>
  </v-app>
</template>

<style>
.layout-enter-active,
.layout-leave-active {
  transition: all 0.2s;
}
.layout-enter-from,
.layout-leave-to {
  opacity: 0;
  filter: blur(0.5rem);
}
</style>

<script setup>
import { useTheme } from "vuetify";

const layout = ref("dark");

useHead({
  title: "Mithical",
});

const vuetifyTheme = useTheme();
const route = useRoute();

watch(route, updateTheme);

function updateTheme() {
  // get the first part of the url
  let theme = route.path.split("/")[1];

  if (!["wacca"].includes(theme)) {
    theme = "mithical";
  }

  layout.value = theme;
  vuetifyTheme.global.name.value = theme;
}

updateTheme();

// load cards from localStorage

const cards = useState("cards", () => []);
const storageCards = localStorage.getItem("cards");

if (storageCards) {
  cards.value = JSON.parse(storageCards);
}
</script>
