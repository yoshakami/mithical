<template>
  <div class="song-sheets">
    <div
      v-for="(difficulty, i) in song.sheets"
      :key="i"
      class="song-difficulty"
    >
      <WaccaMedal :medal="medal(i)" />

      <WaccaDifficultyPill :i="i + 1" :difficulty="difficulty" class="active" />

      <div
        class="song-difficulty-bottom"
        v-if="playerData && playerData.scores[i]"
      >
        <div class="song-score">
          {{ playerData.scores[i].score }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.song-difficulty-bottom {
  background-color: white;
  color: black;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  margin-left: 20px;
  margin-right: 20px;
  font-size: 1rem;
  text-align: center;
}

.song-medal {
  transform: rotate(-10deg);
  height: 40px;
  margin-bottom: -20px;
  text-align: center;
}
</style>

<script setup>
const props = defineProps({
  song: Object,
  playerData: Object,
});

function medal(difficulty) {
  if (!props.playerData || !props.playerData.scores[difficulty]) {
    return "none";
  }

  if (props.playerData.scores[difficulty].all_marvelous_count > 0) {
    return "allmarvelous";
  } else if (props.playerData.scores[difficulty].full_combo_count > 0) {
    return "fullcombo";
  } else if (props.playerData.scores[difficulty].missless_count > 0) {
    return "missless";
  } else if (props.playerData.scores[difficulty].clear_count > 0) {
    return "clear";
  }

  return "none";
}
</script>
