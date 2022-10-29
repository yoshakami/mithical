<template>
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
        {{ category.category }}
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
          <WaccaSong
            :song="song"
            :player-data="playerData[song.id]"
            @toggle-favorite="toggleFavorite(song)"
          />
        </div>
      </div>

      <v-pagination
        v-model="page"
        :length="Math.ceil(filteredSongs.length / perPage)"
      ></v-pagination>
    </ClientOnly>
  </v-container>
</template>

<script setup>
import fuzzysort from "fuzzysort";
import waccaSongs from "~/assets/wacca/waccaSongs.js";

const filters = [
  "Favorites",
  "Uncleared Normal",
  "Uncleared Hard",
  "Uncleared Expert",
  "Uncleared Inferno",
];

const profile = useState("profile");

const perPage = 50;
const page = ref(1);
const search = ref("");
const activeFilters = ref([]);
const activeCategory = ref("");

function randomResult() {
  let score = Math.floor(Math.random() * 1000000);
  let misses = Math.floor(Math.random() * 20);

  if (Math.random() > 0.9) {
    score = 1000000;
    misses = 0;
  }

  return {
    score: score,
    misses: misses,
  };
}

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
        !playerData.value[song.id].scores[3] ||
        (playerData.value[song.id].scores[3].clear_count == 0 &&
          song.sheets.length > 3)
      );
    });
  }

  if (search.value !== "") {
    // perform search
    results = fuzzysort
      .go(search.value, results, {
        keys: ["title", "artist"],
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

function toggleFavorite(song) {
  // playerData.value[song.songId].favorite =
  //   !playerData.value[song.songId].favorite;
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

watch(profile, cachePlayerData);
cachePlayerData();

const categories = [
  { category: "アニメ／ＰＯＰ" },
  { category: "ボカロ" },
  { category: "東方アレンジ" },
  { category: "2.5次元" },
  { category: "バラエティ" },
  { category: "オリジナル" },
  { category: "TANO*C" },
  { category: "TANO*C（オリジナル）" },
];
</script>
