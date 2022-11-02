<template>
  <v-container class="elevation-1 mt-4" style="background: white">
    <div class="single-song">
      <div class="single-song-cover">
        <v-img :src="fullUrl" />
      </div>

      <div class="single-song-header">
        <h1>{{ song.title }}</h1>
        <h1 v-if="song.titleEnglish">{{ song.titleEnglish }}</h1>
        <h2>{{ song.artist }}</h2>

        <v-btn
          color="primary"
          block
          @click="goToSong"
          :loading="loadingGoToSong"
        >
          Jump to this song on next login
        </v-btn>

        <div class="text-center">{{ goToSongMessage }}</div>

        <div style="height: 80px"></div>
        Difficulty selection goes here
      </div>
    </div>

    <div v-if="loading" class="d-flex justify-center">
      <v-progress-circular
        indeterminate
        color="primary"
        :size="80"
        :width="10"
        class="mt-4"
      ></v-progress-circular>
    </div>

    <div v-else>
      <v-alert v-if="loadingError" type="error" class="mt-4">{{
        loadingError
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
            <td>{{ score.user_name }}</td>
            <td>
              <WaccaGrade class="highscore-grade" :grade="score.grade" />
              {{ score.score }}
            </td>
            <td>{{ new Date(score.user_play_date).toLocaleString() }}</td>
          </tr>

          <tr v-if="highscores.length === 0">
            <td colspan="5">No scores yet!</td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </v-container>
</template>

<script setup>
import waccaSongs from "~/assets/wacca/waccaSongs.js";
const runtimeConfig = useRuntimeConfig();
const route = useRoute();
const activeCard = useState("activeCard", () => cards.value[0].luid);

const song = computed(() => {
  return waccaSongs.find((song) => song.id === parseInt(route.params.id));
});

const fullUrl = computed(() => {
  return `/wacca/img/covers/${song.value.imageName}`;
});

const difficulty = ref(2);
const highscores = ref([]);
const loading = ref(false);
const loadingError = ref();

function loadHighscores() {
  loading.value = ref(true);
  $fetch(
    `${runtimeConfig.apiUrl}/wacca/song/${song.value.id}/highscores/${difficulty.value}`
  )
    .then((data) => {
      loading.value = false;
      highscores.value = data;
    })
    .catch((err) => {
      loading.value = false;
      loadingError.value = "Couldn't reach the API. Please try again later.";
    });
}

loadHighscores();

const loadingGoToSong = ref(false);
const goToSongMessage = ref("");

function goToSong() {
  goToSongMessage.value = null;
  loadingGoToSong.value = true;
  $fetch(`${runtimeConfig.apiUrl}/wacca/user/${activeCard.value}/gotosong`, {
    method: "POST",
    body: JSON.stringify({
      music_id: song.value.id,
      difficulty: difficulty.value,
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
