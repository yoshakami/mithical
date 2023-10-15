<template>
  <WaccaProfileRequired>
    <v-container>
      <div class="filters">
        <v-btn
          v-for="category in categories"
          :key="category.ja"
          @click="clickCategory(category.ja)"
          pill
          :color="activeCategory === category.ja ? 'primary' : 'default'"
          :rounded="true"
        >
          {{ language == "ja" ? category.ja : category.en }}
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
        variant="solo"
        single-line
      ></v-text-field>

      <ClientOnly>
        <div class="songs">
          <div v-for="song in paginatedSongs" :key="song.id">
            <NuxtLink :to="`/wacca/songs/${song.id}`">
              <WaccaSong :song="song" :player-data="profile.songs[song.id]" />
            </NuxtLink>
          </div>

          <div v-if="paginatedSongs.length == 0">
            <v-alert type="info" color="primary">No songs found</v-alert>
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

definePageMeta({
  middleware: ["auth"],
});

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
      return profile.value.songs[song.id]?.favorite;
    });
  }

  if (activeFilters.value.includes("Uncleared Normal")) {
    results = results.filter((song) => {
      return (
        !profile.value.songs[song.id].scores[0] ||
        profile.value.songs[song.id].scores[0].clear_count == 0
      );
    });
  }

  if (activeFilters.value.includes("Uncleared Hard")) {
    results = results.filter((song) => {
      return (
        !profile.value.songs[song.id].scores[1] ||
        profile.value.songs[song.id].scores[1].clear_count == 0
      );
    });
  }

  if (activeFilters.value.includes("Uncleared Expert")) {
    results = results.filter((song) => {
      return (
        !profile.value.songs[song.id].scores[2] ||
        profile.value.songs[song.id].scores[2].clear_count == 0
      );
    });
  }

  if (activeFilters.value.includes("Uncleared Inferno")) {
    results = results.filter((song) => {
      return (
        (!profile.value.songs[song.id].scores[3] ||
          profile.value.songs[song.id].scores[3].clear_count == 0) &&
        song.sheets.length > 3
      );
    });
  }

  if (search.value.length > 2) {
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

const categories = [
  { ja: "アニメ／ＰＯＰ", en: "Anime/Pop" },
  { ja: "ボカロ", en: "Vocaloid" },
  { ja: "東方アレンジ", en: "Touhou" },
  { ja: "2.5次元", en: "2.5D" },
  { ja: "バラエティ", en: "Variety" },
  { ja: "オリジナル", en: "Original" },
  { ja: "TANO*C", en: "TANO*C" },
  { ja: "TANO*C（オリジナル）", en: "TANO*C (Original)" },
];

const language = useState("language");
</script>
