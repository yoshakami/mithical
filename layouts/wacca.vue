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

useHead({
  title: "Mithical | Wacca",
});

const profile = useState("profile");
const profileLoading = useState("profileLoading", () => true);
const profileError = useState("profileError");

let luid = "11111111111111111111";
let profileUrl = `${runtimeConfig.apiUrl}/wacca/user/${luid}`;

const {
  pending,
  data: fetchProfile,
  error: fetchError,
} = useLazyFetch(profileUrl);
watch(fetchProfile, (newProfile) => {
  profile.value = newProfile;
});
watch(fetchError, (newError) => {
  profileError.value = newError;
});

watch(pending, (newPending) => {
  profileLoading.value = newPending;
});

async function loadProfile(luid) {
  const data = await $fetch(profileUrl);

  profile.value = data;
}
</script>
