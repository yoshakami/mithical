<template>
  <div class="song">
    <div class="song-cover">
      <v-img :src="fullUrl" />
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
          <WaccaMedal :medal="medal(i)" />

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

<style scoped lang="scss">
$song-paddings: 10px;

.song {
  display: flex;

  margin-bottom: 1rem;

  border-radius: $song-paddings;
  overflow: hidden;

  background-color: rgb(var(--v-theme-boxcolor));
  transition: background-color 0.2s, box-shadow 0.2s;

  &:hover {
    background-color: #444;
    box-shadow: 0 0 10px rgb(var(--v-theme-primary));
  }
}

.song-cover {
  flex-shrink: 0;
  width: 160px;
  height: 160px;

  .v-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .v-img--booting {
    background-color: #888;
  }
}

.song-info {
  flex-grow: 1;
  color: white;
  font-weight: bold;
  min-width: 0;
}

.song-header {
  padding-left: $song-paddings;
  display: flex;
  justify-content: space-between;
  gap: $song-paddings;
}

.song-header-left {
  flex-grow: 1;

  .song-title {
    font-size: 1.5rem;
    margin-bottom: -10px;
  }

  .song-artist {
    font-size: 1rem;
    color: rgb(var(--v-theme-primary));
  }
}

.song-header-right {
  flex-shrink: 0;
}

// difficulties

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

.v-theme--waccaOled .song {
  outline: solid 1px white;
}
</style>

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
