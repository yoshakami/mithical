<template>
  <WaccaProfileRequired>
    <v-container>
      <div class="filters">
        <v-btn
          v-for="category in categories"
          :key="category.category"
          @click="clickCategory(category.category)"
          pill
          :color="activeCategory === category.category ? 'primary' : 'default'"
          :rounded="true"
        >
          {{ category.text }}
        </v-btn>
      </div>

      <div class="filters">
        <v-btn
          v-for="filter in filters"
          :key="filter"
          @click="clickFilter(filter)"
          :color="activeFilters.includes(filter) ? 'primary' : 'default'"
          rounded
        >
          {{ filter }}
        </v-btn>
      </div>

      <v-text-field
        v-model="search"
        label="Find a Song"
        prepend-inner-icon="mdi-magnify"
      ></v-text-field>

      <ClientOnly>
        <div class="songs">
          <div v-for="song in paginatedSongs" :key="song.id">
            <NuxtLink :to="`/wacca/songs/${song.id}`">
              <WaccaSong
                :song="song"
                :player-data="playerData[song.id]"
                @toggle-favorite="toggleFavorite(song)"
              />
            </NuxtLink>
          </div>

          <div v-if="paginatedSongs.length == 0">
            <v-alert type="info">No songs found</v-alert>
          </div>
        </div>

        <v-pagination
          v-model="page"
          :length="Math.ceil(filteredSongs.length / perPage)"
        ></v-pagination>
      </ClientOnly>
    </v-container>
  </WaccaProfileRequired>
</template>

<script setup>
import fuzzysort from "fuzzysort";
import waccaSongs from "~/assets/wacca/waccaSongs.js";
const runtimeConfig = useRuntimeConfig();

const filters = [
  "Favorites",
  "Uncleared Normal",
  "Uncleared Hard",
  "Uncleared Expert",
  "Uncleared Inferno",
];

const profile = useState("profile");
const activeCard = useState("activeCard");

const perPage = 50;
const page = ref(1);
const search = ref("");
const activeFilters = ref([]);
const activeCategory = ref("");

function clickCategory(category) {
  if (activeCategory.value === category) {
    activeCategory.value = "";
  } else {
    activeCategory.value = category;
  }
}

function clickFilter(filter) {
  if (activeFilters.value.includes(filter)) {
    activeFilters.value = activeFilters.value.filter((f) => f !== filter);
  } else {
    activeFilters.value.push(filter);
  }
}

const filteredSongs = computed(() => {
  let results = [];

  results = waccaSongs;

  // category filter
  if (activeCategory.value) {
    results = results.filter((song) => {
      return song.category === activeCategory.value;
    });
  }

  // other filters
  if (activeFilters.value.includes("Favorites")) {
    results = results.filter((song) => {
      return playerData.value[song.id]?.favorite;
    });
  }

  if (activeFilters.value.includes("Uncleared Normal")) {
    results = results.filter((song) => {
      return (
        !playerData.value[song.id].scores[0] ||
        playerData.value[song.id].scores[0].clear_count == 0
      );
    });
  }

  if (activeFilters.value.includes("Uncleared Hard")) {
    results = results.filter((song) => {
      return (
        !playerData.value[song.id].scores[1] ||
        playerData.value[song.id].scores[1].clear_count == 0
      );
    });
  }

  if (activeFilters.value.includes("Uncleared Expert")) {
    results = results.filter((song) => {
      return (
        !playerData.value[song.id].scores[2] ||
        playerData.value[song.id].scores[2].clear_count == 0
      );
    });
  }

  if (activeFilters.value.includes("Uncleared Inferno")) {
    results = results.filter((song) => {
      return (
        (!playerData.value[song.id].scores[3] ||
          playerData.value[song.id].scores[3].clear_count == 0) &&
        song.sheets.length > 3
      );
    });
  }

  if (search.value !== "") {
    // perform search
    results = fuzzysort
      .go(search.value, results, {
        keys: ["title", "artist", "titleEnglish"],
      })
      .map((result) => result.obj);
  }

  return results;
});

const paginatedSongs = computed(() => {
  return filteredSongs.value.slice(
    (page.value - 1) * perPage,
    page.value * perPage
  );
});

// reset page to 1 if the song list changes
watch(filteredSongs, () => {
  page.value = 1;
});

async function toggleFavorite(song) {
  var index = profile.value.favorite_music.indexOf(song.id);

  if (index === -1) {
    profile.value.favorite_music.push(song.id);
  } else {
    profile.value.favorite_music.splice(index, 1);
  }
  cachePlayerData();

  await $fetch(
    `${runtimeConfig.apiUrl}/wacca/user/${activeCard.value}/favorites/${song.id}/toggle`,
    {
      method: "POST",
    }
  );
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
  let scores = [];

  for (let difficulty = 1; difficulty <= song.sheets.length; difficulty++) {
    let music = findMusic(song, difficulty);

    if (music) {
      scores.push(music);
    } else {
      scores.push(null);
    }
  }

  return {
    favorite,
    scores,
  };
}

const playerData = ref({});

function cachePlayerData() {
  for (const song of waccaSongs) {
    playerData.value[song.id] = cacheSongInfo(song);
  }
}

if (profile.value) cachePlayerData(); // cache on page load if profile already exists
watch(profile, cachePlayerData); // cache when profile changes

const categories = [
  { category: "アニメ／ＰＯＰ", text: "Anime/Pop" },
  { category: "ボカロ", text: "Vocaloid" },
  { category: "東方アレンジ", text: "Touhou" },
  { category: "2.5次元", text: "2.5D" },
  { category: "バラエティ", text: "Variety" },
  { category: "オリジナル", text: "Original" },
  { category: "TANO*C", text: "TANO*C" },
  { category: "TANO*C（オリジナル）", text: "TANO*C (Original)" },
];
</script>
