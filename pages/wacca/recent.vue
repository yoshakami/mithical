<template>
  <WaccaProfileRequired>
    <v-container>
      <div v-for="group in playlogGrouped">
        <div class="playlog-hr">{{ group.date }}</div>
        <WaccaPlay v-for="play in group.plays" :play="play" />
      </div>

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

<style scoped lang="scss">
.playlog-hr {
  display: flex;
  align-items: center;
  color: rgba(var(--v-theme-on-background), 0.5);
  gap: 10px;
}
.playlog-hr:before,
.playlog-hr:after {
  content: "";
  flex-grow: 1;
  background: rgba(var(--v-theme-on-background), 0.5);
  height: 1px;
  font-size: 0px;
  line-height: 0px;
}
</style>

<script setup>
definePageMeta({
  middleware: ["auth"],
});

const profile = useState("profile");

const playlogGrouped = computed(() => {
  const grouped = [];

  profile.value.playlog.forEach((play) => {
    const date = new Date(play.info.user_play_date);
    const dateStr = date.toLocaleDateString();

    const group = grouped.find((group) => group.date === dateStr);

    if (group) {
      group.plays.push(play);
    } else {
      grouped.push({
        date: dateStr,
        plays: [play],
      });
    }
  });

  return grouped;
});
</script>
