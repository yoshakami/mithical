<template>
  <v-theme-provider theme="wacca" with-background class="layout">
    <div id="site-logo">
      <img src="/wacca/img/logo.svg" />
    </div>

    <WaccaNav />
    <NuxtPage />
  </v-theme-provider>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>

<script setup>
const runtimeConfig = useRuntimeConfig();
const activeCard = useState("activeCard");

useHead({
  title: "Mithical | Wacca",
});

const profile = useState("profile");
const profileLoading = useState("profileLoading", () => true);
const profileError = useState("profileError");

async function loadProfile() {
  let profileUrl = `${runtimeConfig.apiUrl}/wacca/user/${activeCard.value}`;
  console.log("Loading profile", profileUrl);

  $fetch(profileUrl)
    .then((data) => {
      profile.value = data;
      profileLoading.value = false;
    })
    .catch((err) => {
      profileError.value = err;
      profileLoading.value = false;
    });
}

loadProfile();
watch(activeCard, loadProfile);
</script>
