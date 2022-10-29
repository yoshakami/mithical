<template>
  <div class="song-medal" :class="`medal-${medal}`">
    <span>{{ medalNames[medal] }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  medal: String,
});

const medalNames = {
  allmarvelous: "All Marvelous!!",
  fullcombo: "Full Combo!",
  missless: "Missless!",
  clear: "Clear!",
  failed: "Failed",
};
</script>
