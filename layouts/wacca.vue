<template>
  <v-app>
    <div id="site-logo">
      <img src="/wacca/img/logo.webp" />
    </div>

    <WaccaNav />
    <NuxtPage />
  </v-app>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>

<script setup>
useHead({
  title: "Mithical | Wacca",
});
</script>
