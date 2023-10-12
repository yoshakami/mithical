<template>
  <NuxtLink :to="`/wacca/songs/${song.id}`" style="text-decoration: none">
    <div class="play" :class="{ expanded }">
      <div class="player-header">
        <div class="play-cover">
          <v-img :src="fullUrl" />
        </div>
        <div class="play-info">
          <div class="play-header">
            <div class="play-header-left">
              <span class="play-title">
                {{ getTitle }}
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
              <span class="play-difficulty-number">{{
                song.sheets[play.music_difficulty - 1]
              }}</span>
              {{ difficulties[play.music_difficulty] }}
            </div>

            <div class="play-grade">
              <WaccaGrade :grade="play.grade" />
            </div>

            <div class="play-score">
              {{ props.play.score }}
            </div>

            <!-- <div class="play-pb" v-if="props.play.is_new_record">
              New Record!
            </div> -->

            <div class="play-spacer"></div>

            <WaccaMedal :medal="medal" class="play-medal" />
          </div>
        </div>
      </div>

      <div class="play-detail">
        <div class="play-judgements">
          <div
            class="play-judgement"
            :class="`judgement-${judgement}`"
            v-for="judgement in judgements"
            :key="judgement"
          >
            <div class="play-judgement-label">{{ judgement }}</div>
            <div class="play-judgement-value">
              {{ play[`judge_${judgement.toLowerCase()}`] }}
            </div>
          </div>
        </div>

        <div class="play-judgements">
          <div class="play-judgement judgement-Fast">
            <div class="play-judgement-label">Fast</div>
            <div class="play-judgement-value">
              {{ play.fast }}
            </div>
          </div>

          <div class="play-judgement judgement-Late">
            <div class="play-judgement-label">Late</div>
            <div class="play-judgement-value">
              {{ play.late }}
            </div>
          </div>

          <div class="play-judgement judgement-Combo">
            <div class="play-judgement-label">Combo</div>
            <div class="play-judgement-value">
              {{ play.combo }}
            </div>
          </div>
        </div>
      </div>

      <div class="play-expand">
        <v-btn rounded @click.prevent="expand" color="primary">
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
  </NuxtLink>
</template>

<script setup>
import waccaSongs from "~~/assets/wacca/waccaSongs.js";

const props = defineProps({
  play: Object,
});

const song = computed(() => {
  let song = waccaSongs.find((song) => song.id === props.play.music_id);

  return song;
});

const fullUrl = computed(() => {
  return `/wacca/img/covers/${song.value.imageName}`;
});

function formatDate(date) {
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

const judgements = ["Marvelous", "Great", "Good", "Miss"];

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

const activeLanguage = useState("activeLanguage");

const getTitle = computed(() => {
  if (activeLanguage.value === "ja") {
    return song.value.title;
  } else {
    return song.value.titleEnglish || song.value.title;
  }
});
</script>
