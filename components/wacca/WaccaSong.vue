<template>
  <div class="song">
    <div class="song-cover">
      <v-img :src="fullUrl"> </v-img>
    </div>
    <div class="song-info">
      <div class="song-header">
        <div class="song-header-left">
          <div class="song-title">
            {{ getTitle }}
          </div>

          <div class="song-artist">
            {{ song.artist }}
          </div>
        </div>

        <div class="song-header-right">
          <WaccaFavorite :song-id="song.id" />
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

          <WaccaDifficultyPill
            :i="i + 1"
            :difficulty="difficulty"
            class="active"
          />

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

<script setup>
const props = defineProps({
  song: Object,
  playerData: Object,
});

const fullUrl = computed(() => {
  return `/wacca/img/covers/${props.song.imageName}`;
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

const language = useState("language");

const getTitle = computed(() => {
  if (language.value === "ja") {
    return props.song.title;
  }

  return props.song.titleEnglish || props.song.title;
});
</script>
