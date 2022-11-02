<template>
  <WaccaProfileRequired>
    <v-container>
      <WaccaPlay v-for="play in profile.playlog" :play="play" />

      <div v-if="profile.playlog.length === 0">
        <v-alert type="info" border="left" prominent>
          Looks like you haven't played anything yet!
        </v-alert>
      </div>
    </v-container>
  </WaccaProfileRequired>
</template>

<script setup>
const profile = useState("profile");
</script>
