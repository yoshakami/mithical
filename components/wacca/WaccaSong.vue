<template>
  <div class="song">
    <div class="song-cover">
      <v-img :src="fullUrl" />
    </div>
    <div class="song-info">
      <div class="song-header">
        <div class="song-header-left">
          <div class="song-title">
            {{ song.title }}
          </div>

          <div class="song-artist">
            {{ song.artist }}
          </div>
        </div>

        <div class="song-header-right">
          <div class="song-favorite">
            <v-btn icon @click="toggleFavorite" variant="plain" size="x-large">
              <v-icon color="yellow">{{
                playerData.favorite ? "mdi-star" : "mdi-star-outline"
              }}</v-icon>
            </v-btn>
          </div>
        </div>
      </div>

      <div class="song-sheets">
        <div
          v-for="(difficulty, i) in song.sheets"
          :key="i"
          class="song-difficulty"
        >
          <div class="all-song-medal">
            <div class="song-medal"><WaccaMedal :medal="medal(i)" /></div>
          </div>

          <div
            class="song-difficulty-pill"
            :class="`song-difficulty-${difficulties[i]}`"
          >
            <div class="song-difficulty-name">
              {{ difficulties[i] }}
            </div>

            <div class="song-difficulty-level">
              {{ difficulty }}
            </div>
          </div>

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
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  song: Object,
  playerData: Object,
});

const fullUrl = computed((): string => {
  return `/wacca/img/covers/${props.song.imageName}`;
});

function medal(difficulty): string {
  console.log(difficulty);
  console.log(props.playerData);
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

const emit = defineEmits(["toggleFavorite"]);

function toggleFavorite(): void {
  emit("toggleFavorite");
}

const difficulties = ["Normal", "Hard", "Expert", "Inferno"];
</script>
