<template>
  <MainNav />
  <NuxtLayout :name="layout"> </NuxtLayout>
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

<script setup lang="ts">
import { useTheme } from "vuetify";

const layout = ref("dark");

useHead({
  title: "Mithical",
});

const vuetifyTheme = useTheme();
const route = useRoute();

watch(route, updateTheme);

function updateTheme(): void {
  // get the first part of the url
  let theme = route.path.split("/")[1];

  if (!["wacca"].includes(theme)) {
    theme = "dark";
  }

  layout.value = theme;
  vuetifyTheme.global.name.value = theme;
}

updateTheme();
</script>
