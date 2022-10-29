<template>
  <v-container>
    <div class="filters">
      <v-btn
        v-for="category in waccaData.categories"
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
        <div v-for="song in paginatedSongs" :key="song.songId">
          <WaccaSong
            :song="song"
            :player-data="playerData[song.songId]"
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

<script setup lang="ts">
import fuzzysort from "fuzzysort";
import waccaData from "~/assets/js/waccaData.js";

const filters = [
  "Favorites",
  "Uncleared Normal",
  "Uncleared Hard",
  "Uncleared Expert",
  "Uncleared Inferno",
];

const perPage = 50;
const page = ref(1);
const playerData = ref({});
const search = ref("");
const activeFilters = ref([]);
const activeCategory = ref("");

function generatePlayerData(): void {
  // fake playerData
  for (let song of waccaData.songs) {
    let songData = {
      scores: [],
      favorite: Math.random() > 0.95,
    };
    for (let i = 0; i < song.sheets.length; i++) {
      if (Math.random() > 0.5) {
        songData.scores[i] = randomResult();
      }
    }
    playerData.value[song.songId] = songData;
  }
}

function randomResult(): object {
  let score: number = Math.floor(Math.random() * 1000000);
  let misses: number = Math.floor(Math.random() * 20);

  if (Math.random() > 0.9) {
    score = 1000000;
    misses = 0;
  }

  return {
    score: score,
    misses: misses,
  };
}
generatePlayerData();

function clickCategory(category: string): void {
  if (activeCategory.value === category) {
    activeCategory.value = "";
  } else {
    activeCategory.value = category;
  }
}

function clickFilter(filter: string): void {
  if (activeFilters.value.includes(filter)) {
    activeFilters.value = activeFilters.value.filter((f) => f !== filter);
  } else {
    activeFilters.value.push(filter);
  }
}

const filteredSongs = computed(() => {
  let results = [];

  results = waccaData.songs;

  // category filter
  if (activeCategory.value) {
    results = results.filter((song) => {
      return song.category === activeCategory.value;
    });
  }

  // other filters
  if (activeFilters.value.includes("Favorites")) {
    results = results.filter((song) => {
      return playerData.value[song.songId].favorite;
    });
  }

  if (activeFilters.value.includes("Uncleared Normal")) {
    results = results.filter((song) => {
      return !playerData.value[song.songId].scores[0];
    });
  }

  if (activeFilters.value.includes("Uncleared Hard")) {
    results = results.filter((song) => {
      return !playerData.value[song.songId].scores[1];
    });
  }

  if (activeFilters.value.includes("Uncleared Expert")) {
    results = results.filter((song) => {
      return !playerData.value[song.songId].scores[2];
    });
  }

  if (activeFilters.value.includes("Uncleared Inferno")) {
    results = results.filter((song) => {
      return !playerData.value[song.songId].scores[3] && song.sheets.length > 3;
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
  playerData.value[song.songId].favorite =
    !playerData.value[song.songId].favorite;
}
</script>
