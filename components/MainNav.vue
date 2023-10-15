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

    <v-btn @click="openSettings" icon variant="plain">
      <v-icon>mdi-cog</v-icon>
    </v-btn>

    <v-select
      class="nav-select"
      v-model="activeCard"
      :items="cards"
      item-title="user_name"
      item-value="luid"
      hide-details
      single-line
      prepend-inner-icon="mdi-card-account-details-outline"
      no-data-text="No cards added yet"
    />
    <div class="nav-spacer"></div>
    <NuxtLink to="/wacca">Wacca</NuxtLink>
  </div>
</template>

<script setup>
const cards = useState("cards");
const activeCard = useState("activeCard");

watch(activeCard, (newVal) => {
  if (newVal) {
    localStorage.setItem("activeCard", newVal);
  }
});

const settingsVisible = useState("settingsVisible");

function openSettings() {
  settingsVisible.value = true;
}
</script>
