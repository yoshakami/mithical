<template>
  <div class="play" :class="{ expanded }">
    <div class="play-cover">
      <v-img :src="fullUrl" />
    </div>
    <div class="play-info">
      <div class="play-header">
        <div class="play-header-left">
          <span class="play-title">
            {{ song.title }}
          </span>

          <span class="play-artist">
            {{ song.artist }}
          </span>
        </div>

        <div class="play-header-right">
          {{ formatDate(play.user_play_date) }}
        </div>
      </div>

      <div class="play-stats">
        <div
          class="play-difficulty"
          :class="`difficulty-${play.music_difficulty}`"
        >
          {{ difficulties[play.music_difficulty] }}
        </div>

        <div class="play-score">
          {{ props.play.score }}
        </div>

        <div class="play-pb" v-if="props.play.is_new_record">New Record!</div>

        <div class="play-spacer"></div>

        <WaccaMedal :medal="medal" />
      </div>

      <div class="play-detail">
        bla <br />
        bla <br />
        this needs to animate <br />
        bla <br />
        bla <br />
        bla <br />
        bla <br />
      </div>
    </div>

    <div class="play-expand">
      <v-btn rounded @click="expand" color="primary">
        <div v-if="!expanded">
          <v-icon>mdi-chevron-down</v-icon>
          More
        </div>
        <div v-if="expanded">
          <v-icon>mdi-chevron-up</v-icon>
          Less
        </div>
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import waccaData from "~/assets/js/waccaData.js";

const props = defineProps({
  play: Object,
});

const song = computed(() => {
  let song = waccaData.songs.find((s) => s.songId === props.play.music_id);

  return song;
});

const fullUrl = computed((): string => {
  return `/wacca/img/covers/${song.value.imageName}`;
});

function formatDate(date: string): string {
  return new Date(date).toLocaleString();
}

const expanded = ref(false);
function expand() {
  expanded.value = !expanded.value;
}

const difficulties = {
  1: "Normal",
  2: "Hard",
  3: "Expert",
  4: "Inferno",
};

const medal = computed(() => {
  if (props.play.is_all_marvelous) {
    return "allmarvelous";
  } else if (props.play.is_full_combo) {
    return "fullcombo";
  } else if (props.play.is_missless) {
    return "missless";
  } else if (props.play.is_clear) {
    return "clear";
  } else {
    return "failed";
  }
});
</script>
