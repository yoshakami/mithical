<template>
  <div style="padding-bottom: 4em">
    <v-container class="elevation-1 mt-4" style="background: white">
      <div class="single-song">
        <div class="single-song-cover">
          <v-img :src="fullUrl" />
        </div>

        <div class="single-song-header">
          <h1>{{ song.title }}</h1>
          <p class="text-grey" v-if="song.titleEnglish">
            ({{ song.titleEnglish }})
          </p>
          <h2>{{ song.artist }}</h2>

          <v-btn
            class="mt-4"
            color="primary"
            block
            @click="goToSong"
            :loading="loadingGoToSong"
          >
            Jump to this song on next login
          </v-btn>

          <div class="text-center mt-4">{{ goToSongMessage }}</div>
        </div>
      </div>
    </v-container>

    <v-container class="elevation-1 mt-4" style="background: white">
      <h2>Your scores</h2>
      <WaccaChart ref="chart" :player-history="playerHistory" :song="song" />
    </v-container>

    <v-container class="elevation-1 mt-4" style="background: white">
      <h2>Leaderboards</h2>
      <div class="song-sheets difficulty-selection mt-4">
        <div
          v-for="(difficulty, i) in song.sheets"
          :key="i"
          class="song-difficulty"
        >
          <div
            class="song-difficulty-pill"
            :class="[
              `song-difficulty-${i + 1}`,
              { active: i + 1 == selectedDifficulty },
            ]"
            @click="selectDifficulty(i + 1)"
          >
            <div class="song-difficulty-name">
              {{ waccaDifficulties.find((d) => d.id === i + 1).name }}
            </div>

            <div class="song-difficulty-level">
              {{ difficulty }}
            </div>
          </div>
        </div>
      </div>

      <div v-if="leaderboardsLoading" class="d-flex justify-center">
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
            <tr v-for="(score, i) in highscores" :key="i">
              <td class="text-right">{{ i + 1 }}</td>
              <td>
                <WaccaIcon class="highscore-icon" :icon="score.user_icon" />
                {{ score.user_name }}
              </td>
              <td>
                <WaccaGrade class="highscore-grade" :grade="score.grade" />
                {{ score.score }}
              </td>
              <td>{{ new Date(score.user_play_date).toLocaleString() }}</td>
            </tr>

            <tr v-if="highscores.length === 0">
              <td colspan="5" class="text-center">No scores yet!</td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </v-container>
  </div>
</template>

<script setup>
import waccaSongs from "~/assets/wacca/waccaSongs.js";
import waccaDifficulties from "~/assets/wacca/waccaDifficulties";

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

const selectedDifficulty = ref(3);
const highscores = ref([]);
const leaderboardsLoading = ref(false);
const leaderboardsLoadingError = ref();

const playerHistory = ref([]);

function loadData() {
  leaderboardsLoading.value = ref(true);
  $fetch(
    `${runtimeConfig.apiUrl}/wacca/song/${song.value.id}/highscores/${selectedDifficulty.value}`
  )
    .then((data) => {
      leaderboardsLoading.value = false;
      highscores.value = data;
    })
    .catch((err) => {
      leaderboardsLoading.value = false;
      leaderboardsLoadingError.value =
        "Couldn't reach the API. Please try again later.";
    });
}

function selectDifficulty(difficulty) {
  selectedDifficulty.value = difficulty;
  loadData();
}
loadData();

function loadPlayerData() {
  $fetch(
    `${runtimeConfig.apiUrl}/wacca/user/${activeCard.value}/song/${song.value.id}/${selectedDifficulty.value}`
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
watch(activeCard, loadPlayerData);
loadPlayerData();

// Jump to song on next login

const loadingGoToSong = ref(false);
const goToSongMessage = ref("");

function goToSong() {
  goToSongMessage.value = null;
  loadingGoToSong.value = true;
  $fetch(`${runtimeConfig.apiUrl}/wacca/user/${activeCard.value}/gotosong`, {
    method: "POST",
    body: JSON.stringify({
      music_id: song.value.id,
      difficulty: selectedDifficulty.value,
    }),
  })
    .then((data) => {
      loadingGoToSong.value = false;
      goToSongMessage.value =
        "Song set! Wacca will jump to this song on your next login. Good luck!";
    })
    .catch((err) => {
      loadingGoToSong.value = false;
      goToSongMessage.value = "Couldn't reach the API. Please try again later.";
    });
}
</script>
