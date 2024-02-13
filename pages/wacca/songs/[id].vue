<template>
  <WaccaProfileRequired>
    <v-container class="elevation-1 mt-4">
      <div class="single-song">
        <div class="single-song-cover">
          <v-img :src="fullUrl" />
        </div>

        <div class="single-song-details">
          <div class="single-song-header">
            <div class="single-song-header-left">
              <h1 class="title">{{ getTitle }}</h1>
              <h2 class="artist">{{ song.artist }}</h2>
            </div>
            <div class="single-song-header-right">
              <WaccaFavorite :song-id="song.id" />
            </div>
          </div>

          <div class="single-song-pills">
            <v-chip prepend-icon="mdi-pulse">{{ song.bpm }} bpm</v-chip>
            <v-chip prepend-icon="mdi-plus">
              {{ formatDate(song.dateAdded) }}</v-chip
            >
            <v-chip v-if="song.dateRemoved != 0" prepend-icon="mdi-minus">
              {{ formatDate(song.dateRemoved) }}</v-chip
            >
            <v-chip v-if="profile" prepend-icon="mdi-pound">
              {{ profile.songs[song.id].playCount }}
              play{{ profile.songs[song.id].playCount == 1 ? "" : "s" }}
            </v-chip>
            <v-chip
              v-if="profile && profile.songs[song.id].favorite"
              prepend-icon="mdi-star"
            >
              Favorite
            </v-chip>
            <v-chip
              v-if="profile.songs[song.id].rating != 0"
              prepend-icon="mdi-arrow-up-bold"
            >
              {{ profile.songs[song.id].rating / 10 }}
              Rating
            </v-chip>
          </div>

          <!-- <v-btn
            class="mt-4"
            color="primary"
            block
            @click="goToSong"
            :loading="loadingGoToSong"
          >
            Jump to this song on next login
          </v-btn>

          <div class="text-center mt-4">{{ goToSongMessage }}</div> -->
        </div>

        <div class="single-song-game">
          <img :src="`/wacca/img/games/${song.gameVersion}.webp`" />
        </div>
      </div>
    </v-container>

    <v-container class="elevation-1 mt-4">
      <h2 class="container-heading">Your scores</h2>

      <WaccaSongSheets :song="song" :player-data="profile.songs[song.id]" />
      <WaccaChart ref="chart" :player-history="playerHistory" :song="song" />
    </v-container>

    <v-container class="elevation-1 mt-4">
      <h2 class="container-heading">
        Histograms

        <v-tooltip location="end">
          <template v-slot:activator="{ props }">
            <v-icon v-bind="props" color="primary"
              >mdi-information-outline</v-icon
            >
          </template>
          <span
            >Histograms show the distribution of scores of everyone on the
            network.</span
          >
        </v-tooltip>
      </h2>
      <div v-if="histogramsLoading" class="d-flex justify-center">
        <v-progress-circular
          indeterminate
          color="primary"
          :size="80"
          :width="10"
          class="mt-4"
        ></v-progress-circular>
      </div>

      <div v-else>
        <v-alert v-if="histogramsLoadingError" type="error" class="mt-4">{{
          histogramsLoadingError
        }}</v-alert>

        <div v-else class="histograms">
          <WaccaHistogram
            v-for="(difficulty, i) in song.sheets"
            :key="i"
            :scores="histograms[i]?.score_entries"
            :color="waccaDifficulties[i].color"
            :label="waccaDifficulties[i].name"
            :score="profile.songs[song.id]?.scores[i]?.score"
          />
        </div>
      </div>
    </v-container>

    <v-container class="elevation-1 mt-4">
      <h2 class="container-heading">Leaderboards</h2>
      <div class="song-sheets difficulty-selection mt-4">
        <div
          v-for="(difficulty, i) in song.sheets"
          :key="i"
          class="song-difficulty"
        >
          <WaccaDifficultyPill
            v-ripple
            :i="i + 1"
            :difficulty="difficulty"
            :class="{ active: i + 1 == selectedDifficulty }"
            @click="selectDifficulty(i + 1)"
          />
        </div>
      </div>

      <div v-if="leaderboardsLoading" class="d-flex justify-center py-5">
        <v-progress-circular
          indeterminate
          color="primary"
          :size="80"
          :width="10"
          class="mt-4"
        ></v-progress-circular>
      </div>

      <div v-else>
        <v-alert v-if="leaderboardsLoadingError" type="error" class="mt-4">{{
          leaderboardsLoadingError
        }}</v-alert>

        <v-table v-else>
          <thead>
            <tr>
              <th width="1%">Rank</th>
              <th>Name</th>
              <th>Score</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(score, i) in highscores"
              :key="i"
              :class="{ highlight: score.user_name == profile.user_name }"
            >
              <td class="text-right">
                <span v-if="i == 0 || highscores[i - 1].score != score.score">
                  {{ i + 1 }}
                </span>
              </td>
              <td>
                <WaccaIcon class="highscore-icon" :icon="score.user_icon_id" />
                {{ score.user_name }}
              </td>
              <td>
                <WaccaGrade class="highscore-grade" :grade="score.grade" />
                {{ score.score }}
              </td>
              <td>{{ formatDateLeaderboard(score.user_play_date) }}</td>
            </tr>

            <tr v-if="highscores.length === 0">
              <td colspan="5" class="text-center">No scores yet!</td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </v-container>
  </WaccaProfileRequired>
</template>

<style scoped lang="scss">
.v-container {
  padding: 0;
  background: rgb(var(--v-theme-surface));
}

.container-heading {
  padding: 5px 10px;
}

.single-song {
  position: relative;
  display: flex;
  gap: 10px;
}

.artist {
  color: rgb(var(--v-theme-primary));
}

.single-song-cover {
  width: 320px;
}

.single-song-details {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.single-song-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.single-song-pills {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

.single-song-pill {
  border-radius: 50px;
  padding: 5px 10px;
  background-color: rgb(var(--v-theme-surface-variant));
  color: white;
  font-weight: 700;
}

.single-song-game {
  position: absolute;
  bottom: 10px;
  right: 10px;
  height: 50px;

  img {
    height: 100%;
  }
}

.highscore-grade,
.highscore-icon {
  height: 40px;
  vertical-align: middle;
}

.histograms {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 300px 300px;
  gap: 10px;

  .histogram {
    width: 100%;
    height: 100%;
  }

  @media (max-width: 600px) {
    grid-template-columns: 100%;
    grid-template-rows: 300px 300px 300px 300px;
  }
}

.difficulty-selection {
  :deep(.song-difficulty-pill) {
    cursor: pointer;
  }
}

tr.highlight {
  background-color: rgba(var(--v-theme-primary), 0.1);
}
</style>

<script setup>
import { Chart, registerables } from "chart.js";
import "chartjs-adapter-moment";
import zoomPlugin from "chartjs-plugin-zoom";
import annotationPlugin from "chartjs-plugin-annotation";

Chart.register(zoomPlugin);
Chart.register(...registerables);
Chart.register(annotationPlugin);

import waccaSongs from "~/assets/wacca/waccaSongs.js";
import waccaDifficulties from "~/assets/wacca/waccaDifficulties";

const profile = useState("profile");

definePageMeta({
  middleware: ["auth"],
});

const runtimeConfig = useRuntimeConfig();
const route = useRoute();
const activeCard = useState("activeCard");

const song = computed(() => {
  return waccaSongs.find((song) => song.id === parseInt(route.params.id));
});

const fullUrl = computed(() => {
  return `/wacca/img/covers/${song.value.imageName}`;
});

const selectedDifficulty = ref(song.value.sheets.length);
const highscores = ref([]);
const leaderboardsLoading = ref(false);
const leaderboardsLoadingError = ref();
const histograms = ref([]);
const histogramsLoading = ref(false);
const histogramsLoadingError = ref();

const playerHistory = ref([]);

function loadData() {
  leaderboardsLoading.value = ref(true);
  $fetch(
    `${runtimeConfig.public.apiUrl}/wacca/music/${song.value.id}/highscores/${selectedDifficulty.value}`
  )
    .then((data) => {
      leaderboardsLoading.value = false;
      highscores.value = data;
      leaderboardsLoadingError.value = null;
    })
    .catch((err) => {
      leaderboardsLoading.value = false;
      leaderboardsLoadingError.value =
        "Couldn't reach the API. Please try again later.";
    });
}

function loadHistograms() {
  histogramsLoading.value = ref(true);
  $fetch(
    `${runtimeConfig.public.apiUrl}/wacca/music/${song.value.id}/histogram`
  )
    .then((data) => {
      histogramsLoading.value = false;
      histograms.value = data;
      histogramsLoadingError.value = null;
    })
    .catch((err) => {
      histogramsLoading.value = false;
      histogramsLoadingError.value =
        "Couldn't reach the API. Please try again later.";
    });
}

function selectDifficulty(difficulty) {
  selectedDifficulty.value = difficulty;
  loadData();
}
loadData();
loadHistograms();

function loadPlayerHistory() {
  $fetch(
    `${runtimeConfig.public.apiUrl}/wacca/user/${activeCard.value}/music/${song.value.id}`
  ).then((data) => {
    playerHistory.value = data;
  });
}

const chart = ref(null);

watch(playerHistory, () => {
  setTimeout(() => {
    chart.value.updateChart();
  }, 0); //?
});
watch(activeCard, loadPlayerHistory);
loadPlayerHistory();

// Jump to song on next login

// const loadingGoToSong = ref(false);
// const goToSongMessage = ref("");

// function goToSong() {
//   goToSongMessage.value = null;
//   loadingGoToSong.value = true;
//   $fetch(`${runtimeConfig.public.apiUrl}/wacca/user/${activeCard.value}/gotomusic`, {
//     method: "POST",
//     body: JSON.stringify({
//       music_id: song.value.id,
//       difficulty: selectedDifficulty.value,
//     }),
//   })
//     .then((data) => {
//       loadingGoToSong.value = false;
//       goToSongMessage.value =
//         "Song set! Wacca will jump to this song on your next login. Good luck!";
//     })
//     .catch((err) => {
//       loadingGoToSong.value = false;
//       goToSongMessage.value = "Couldn't reach the API. Please try again later.";
//     });
// }

const language = useState("language");

const getTitle = computed(() => {
  if (language.value === "ja") {
    return song.value.title;
  }

  return song.value.titleEnglish || song.value.title;
});

function formatDate(date) {
  if (date == 0) {
    date = 20190718;
  }
  const strDate = date.toString();

  let year = strDate.slice(0, 4);
  let month = strDate.slice(4, 6);
  let day = strDate.slice(6, 8);
  return new Date(`${year}-${month}-${day}`).toLocaleDateString();
}

function formatDateLeaderboard(date) {
  if (date == "1970-01-01T00:00:00+00:00") {
    return "Unknown";
  }

  return new Date(date).toLocaleString();
}

useSeoMeta({
  title: `Mithical | ${getTitle.value}`,
  ogTitle: `Mithical | ${getTitle.value}`,
  description: "View your scores and the leaderboards for this song!",
  ogDescription: "View your scores and the leaderboards for this song!",
  ogImage: fullUrl.value,
  twitterCard: "summary",
});
</script>
