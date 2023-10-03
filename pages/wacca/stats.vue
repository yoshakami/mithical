<template>
  <WaccaProfileRequired>
    <v-container>
      <h1>Average score for difficulty</h1>
      <h1>Best leaderboard placement</h1>
      <h1>Worst leaderboard placement</h1>
    </v-container>
  </WaccaProfileRequired>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"],
});

const profile = useState("profile");
</script>
