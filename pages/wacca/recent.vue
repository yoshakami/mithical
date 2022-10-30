<template>
  <WaccaProfileRequired>
    <v-container>
      <WaccaPlay v-for="play in profile.playlog" :play="play" />
    </v-container>
  </WaccaProfileRequired>
</template>

<script setup>
const profile = useState("profile");
</script>
