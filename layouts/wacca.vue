<template>
  <v-theme-provider :theme="`wacca${theme}`" class="wacca" with-background>
    <div id="site-logo">
      <img src="/wacca/img/logo.svg" />
    </div>

    <WaccaNav />
    <NuxtPage />
  </v-theme-provider>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>

<script setup>
import waccaSongs from "~/assets/wacca/waccaSongs.js";

const theme = useState("theme");
const runtimeConfig = useRuntimeConfig();
const activeCard = useState("activeCard");

useHead({
  title: "Mithical | Wacca",
});

const profile = useState("profile");
const profileLoading = useState("profileLoading", () => false);
const profileError = useState("profileError");

async function loadProfile() {
  profileLoading.value = true;
  profileError.value = null;

  if (activeCard.value) {
    let profileUrl = `${runtimeConfig.public.apiUrl}/wacca/user/${activeCard.value}`;

    $fetch(profileUrl)
      .then((data) => {
        profile.value = data;
        profileLoading.value = false;

        cachePlayerSongs();
      })
      .catch((err) => {
        profileLoading.value = false;
        profileError.value = "Couldn't reach the API. Please try again later.";
      });
  }
}

function findMusic(song, difficulty) {
  return profile.value.music.find((music) => {
    return music.music_id === song.id && music.music_difficulty === difficulty;
  });
}

// getting the song and sheet data by id/difficulty
// is a lot of .find so we cache them in playerData
function cacheSongInfo(song) {
  let favorite = profile.value.favorite_music.includes(song.id);
  let playCount = 0;
  let scores = [];

  for (let difficulty = 1; difficulty <= song.sheets.length; difficulty++) {
    let music = findMusic(song, difficulty);

    if (music) {
      playCount += music.play_count;
      scores.push(music);
    } else {
      scores.push(null);
    }
  }

  return {
    favorite,
    scores,
    playCount,
  };
}

function cachePlayerSongs() {
  profile.value.songs = [];
  for (const song of waccaSongs) {
    profile.value.songs[song.id] = cacheSongInfo(song);
  }
}

loadProfile();
watch(activeCard, loadProfile);
</script>
