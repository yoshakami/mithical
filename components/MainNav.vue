<template>
  <div id="nav">
    <NuxtLink to="/">
      <svg height="40" viewBox="0 0 100 84">
        <path
          fill="white"
          d="M 0.17,83.83
           C 0.17,83.83 39.53,0.26 39.53,0.26
             39.53,0.26 48.53,19.11 48.53,19.11
             48.53,19.11 17.99,83.74 17.99,83.74
             17.99,83.74 0.17,83.83 0.17,83.83 Z
           M 21.63,83.83
           C 21.63,83.83 50.78,22.38 50.78,22.38
             50.78,22.38 60.55,43.12 60.55,43.12
             60.55,43.12 70.67,22.29 70.67,22.29
             70.67,22.29 100.00,83.83 100.00,83.83
             100.00,83.83 78.98,83.91 78.98,83.91
             78.98,83.91 70.59,66.53 70.59,66.53
             70.59,66.53 62.28,83.74 62.28,83.74
             62.28,83.74 21.63,83.83 21.63,83.83 Z"
        />
      </svg>
    </NuxtLink>
    <v-select
      v-model="profile"
      :items="profiles"
      class="profile-select"
      hide-details
      single-line
      prepend-inner-icon="mdi-card-account-details-outline"
    />
    <NuxtLink to="/wacca" class="ml-16">Wacca</NuxtLink>
    <NuxtLink to="#">Chunithm</NuxtLink>
    <NuxtLink to="#">Initial D</NuxtLink>
    <NuxtLink to="#">Whatever else SEGA has</NuxtLink>
  </div>
</template>

<script setup>
const profile = ref("Maurice");
const profiles = ref(["Maurice", "Maurice but longer"]);
</script>
