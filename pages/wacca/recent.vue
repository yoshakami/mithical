<template>
  <WaccaProfileRequired>
    <v-container>
      <WaccaPlay v-for="play in profile.playlog" :play="play" />

      <div v-if="profile.playlog.length === 0">
        <v-alert type="info" border="left" prominent>
          Looks like you haven't played anything yet!
        </v-alert>
      </div>

      <div v-if="profile.playlog.length == 100">
        <p class="text-grey-darken-2 text-center">
          Only the most recent 100 plays are shown.
        </p>
      </div>
    </v-container>
  </WaccaProfileRequired>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"],
});

const profile = useState("profile");
</script>
