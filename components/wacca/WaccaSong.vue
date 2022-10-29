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
          v-for="(sheet, i) in song.sheets"
          :key="sheet.difficulty"
          class="song-difficulty"
        >
          <div class="all-song-medal">
            <div class="song-medal"><WaccaMedal :medal="medal(i)" /></div>
          </div>

          <div
            class="song-difficulty-pill"
            :class="'song-difficulty-' + sheet.difficulty"
          >
            <div class="song-difficulty-name">
              {{ sheet.difficulty }}
            </div>

            <div class="song-difficulty-level">
              {{ sheet.level }}
            </div>
          </div>

          <div
            class="song-difficulty-bottom"
            v-if="playerData && playerData.scores[i]"
          >
            <div class="song-score">
              {{ formatScore(playerData.scores[i].score) }}
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

function formatScore(score: number): string {
  return score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function medal(i: number): string {
  if (!props.playerData || typeof props.playerData.scores[i] === "undefined") {
    return "none";
  }

  if (props.playerData.scores[i].score == 1000000) {
    return "allmarvelous";
  } else if (props.playerData.scores[i].misses === 0) {
    return "fullcombo";
  } else if (props.playerData.scores[i].misses <= 5) {
    return "missless";
  } else {
    return "clear";
  }
}

const emit = defineEmits(["toggleFavorite"]);

function toggleFavorite(): void {
  emit("toggleFavorite");
}
</script>
