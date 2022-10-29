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

// profile stuff
const profiles = useState("profiles", () => [
  {
    luid: "11111111111111111111",
  },
]);

const profile = useState("profile", () => {
  return {};
});

async function loadProfile(luid) {
  const data = await $fetch(`http://192.168.0.150:3001/wacca/user/${luid}`);

  profile.value = data;
}

loadProfile(profiles.value[0].luid);
</script>
