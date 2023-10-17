<template>
  <WaccaProfileRequired>
    <v-container>
      <div class="song-options">
        <v-btn-group>
          <v-btn color="primary">
            {{ activeSort.text == "Default" ? "Sorting" : activeSort.text }}

            <v-menu activator="parent">
              <v-card class="sort-menu">
                <v-btn
                  variant="plain"
                  v-for="sortOption in sortOptions"
                  :id="sortOption.text"
                  @click="clickSort(sortOption)"
                  :color="
                    activeSort.text.includes(sortOption.text) ? 'primary' : ''
                  "
                >
                  {{ sortOption.text }}

                  <v-icon v-if="sortOption.subItems">mdi-chevron-right</v-icon>

                  <v-menu
                    v-if="sortOption.subItems"
                    location="end"
                    activator="parent"
                    transition="slide-x-transition"
                  >
                    <v-card class="sort-menu">
                      <v-btn
                        variant="plain"
                        v-for="sortOptionSub in sortOption.subItems"
                        :id="sortOptionSub.text"
                        @click="clickSort(sortOptionSub)"
                        :color="
                          sortOptionSub.text == activeSort.text ? 'primary' : ''
                        "
                      >
                        {{ sortOptionSub.subText }}
                      </v-btn>
                    </v-card>
                  </v-menu>
                </v-btn>
              </v-card>
            </v-menu>
          </v-btn>

          <v-btn
            color="primary"
            @click="toggleSortDirection"
            class="sort-order-button"
          >
            <div v-if="sortOrder == 'asc'">
              <v-icon>mdi-arrow-expand-up</v-icon>
            </div>
            <div v-else>
              <v-icon>mdi-arrow-expand-down</v-icon>
            </div>
          </v-btn>
        </v-btn-group>

        <v-btn-group>
          <v-btn color="primary">
            Filters

            <v-menu activator="parent">
              <div class="song-filters" @click.stop>
                <div class="song-filter-help">
                  <div>No</div>
                  <div>All</div>
                  <div>Yes</div>
                </div>
                <div
                  v-for="filter in filters"
                  class="song-filter-row"
                  :class="{ heading: !filter.subItems }"
                >
                  <div class="song-filter-label">
                    {{ filter.text }}
                  </div>

                  <v-btn-group rounded="0" v-if="filter.subItems">
                    <v-btn
                      variant="text"
                      v-for="filterSub in filter.subItems"
                      @click="clickFilter(filter, filterSub)"
                      :color="filterSub.active ? 'primary' : ''"
                    >
                      <v-icon>{{
                        filterSub.active ? filterSub.iconActive : filterSub.icon
                      }}</v-icon>
                    </v-btn>
                  </v-btn-group>
                </div>
              </div>
            </v-menu>
          </v-btn>
        </v-btn-group>

        <v-btn-group>
          <v-btn color="primary"> Categories </v-btn>

          <v-menu activator="parent">
            <div class="song-categories" @click.stop>
              <v-checkbox
                hide-details
                color="primary"
                v-for="category in categories"
                v-model="activeCategories"
                :value="category.ja"
              >
                <template v-slot:label>
                  {{ language == "ja" ? category.ja : category.en }}
                </template>
              </v-checkbox>
            </div>
          </v-menu>
        </v-btn-group>

        <v-text-field
          class="song-search"
          v-model="search"
          label="Find a Song"
          prepend-inner-icon="mdi-magnify"
          variant="solo"
          single-line
          hide-details
          clearable
          height="40"
        ></v-text-field>
      </div>

      Showing {{ songsFiltered.length }} of {{ waccaSongs.length }} songs

      <div class="songs">
        <div v-for="song in songsPaginated" :key="song.id">
          <NuxtLink :to="`/wacca/songs/${song.id}`">
            <WaccaSong :song="song" :player-data="profile.songs[song.id]" />
          </NuxtLink>
        </div>

        <div v-if="songsPaginated.length == 0">
          <v-alert type="info" color="primary"
            >No songs found, try changing your search or filters!</v-alert
          >
        </div>
      </div>

      <v-pagination
        v-model="page"
        :length="Math.ceil(songsFiltered.length / perPage)"
      ></v-pagination>
    </v-container>
  </WaccaProfileRequired>
</template>

<script setup>
import fuzzysort from "fuzzysort";
import waccaSongs from "~/assets/wacca/waccaSongs.js";

const language = useState("language");

definePageMeta({
  middleware: ["auth"],
  keepalive: true,
});

const sortOptions = [
  {
    text: "Default",
    sortFunction: () => {
      return sortOrder.value == "asc" ? 1 : -1;
    },
  },
  {
    text: "Title",
    sortFunction: (a, b) => {
      let aTitle = a.titleEnglish || a.title;
      let bTitle = b.titleEnglish || b.title;

      if (language.value == "ja") {
        aTitle = a.title;
        bTitle = b.title;
      }

      if (sortOrder.value == "asc") {
        return aTitle.localeCompare(bTitle);
      } else {
        return bTitle.localeCompare(aTitle);
      }
    },
  },
  {
    text: "Artist",
    sortFunction: (a, b) => {
      if (sortOrder.value == "asc") {
        return a.artist.localeCompare(b.artist);
      } else {
        return b.artist.localeCompare(a.artist);
      }
    },
  },
  {
    text: "Play Count",
    defaultSort: "desc",
    sortFunction(a, b) {
      if (sortOrder.value == "asc") {
        return (
          (profile.value.songs[a.id]?.playCount ?? 0) -
          (profile.value.songs[b.id]?.playCount ?? 0)
        );
      } else {
        return (
          (profile.value.songs[b.id]?.playCount ?? 0) -
          (profile.value.songs[a.id]?.playCount ?? 0)
        );
      }
    },
  },
  {
    text: "Difficulty",
    subItems: [
      {
        text: "Normal Difficulty",
        subText: "Normal",
        sortFunction(a, b) {
          if (sortOrder.value == "asc") {
            return a.sheets[0] - b.sheets[0];
          } else {
            return b.sheets[0] - a.sheets[0];
          }
        },
      },
      {
        text: "Hard Difficulty",
        subText: "Hard",
        sortFunction(a, b) {
          if (sortOrder.value == "asc") {
            return a.sheets[1] - b.sheets[1];
          } else {
            return b.sheets[1] - a.sheets[1];
          }
        },
      },
      {
        text: "Expert Difficulty",
        subText: "Expert",
        sortFunction(a, b) {
          if (sortOrder.value == "asc") {
            return a.sheets[2] - b.sheets[2];
          } else {
            return b.sheets[2] - a.sheets[2];
          }
        },
      },
      {
        text: "Inferno Difficulty",
        subText: "Inferno",
        sortFunction(a, b) {
          if (sortOrder.value == "asc") {
            return (a.sheets[3] ?? 16) - (b.sheets[3] ?? 16);
          } else {
            return (b.sheets[3] ?? 0) - (a.sheets[3] ?? 0);
          }
        },
      },
    ],
  },
  {
    text: "Score",
    subItems: [
      {
        text: "Normal Score",
        subText: "Normal",
        sortFunction(a, b) {
          if (sortOrder.value == "asc") {
            return (
              (profile.value.songs[a.id]?.scores[0]?.score ?? 1000001) -
              (profile.value.songs[b.id]?.scores[0]?.score ?? 1000001)
            );
          } else {
            return (
              (profile.value.songs[b.id]?.scores[0]?.score ?? 0) -
              (profile.value.songs[a.id]?.scores[0]?.score ?? 0)
            );
          }
        },
      },
      {
        text: "Hard Score",
        subText: "Hard",
        sortFunction(a, b) {
          if (sortOrder.value == "asc") {
            return (
              (profile.value.songs[a.id]?.scores[1]?.score ?? 1000001) -
              (profile.value.songs[b.id]?.scores[1]?.score ?? 1000001)
            );
          } else {
            return (
              (profile.value.songs[b.id]?.scores[1]?.score ?? 0) -
              (profile.value.songs[a.id]?.scores[1]?.score ?? 0)
            );
          }
        },
      },
      {
        text: "Expert Score",
        subText: "Expert",
        sortFunction(a, b) {
          if (sortOrder.value == "asc") {
            return (
              (profile.value.songs[a.id]?.scores[2]?.score ?? 1000001) -
              (profile.value.songs[b.id]?.scores[2]?.score ?? 1000001)
            );
          } else {
            return (
              (profile.value.songs[b.id]?.scores[2]?.score ?? 0) -
              (profile.value.songs[a.id]?.scores[2]?.score ?? 0)
            );
          }
        },
      },
      {
        text: "Inferno Score",
        subText: "Inferno",
        sortFunction(a, b) {
          if (sortOrder.value == "asc") {
            return (
              (profile.value.songs[a.id]?.scores[3]?.score ?? 1000001) -
              (profile.value.songs[b.id]?.scores[3]?.score ?? 1000001)
            );
          } else {
            return (
              (profile.value.songs[b.id]?.scores[3]?.score ?? 0) -
              (profile.value.songs[a.id]?.scores[3]?.score ?? 0)
            );
          }
        },
      },
    ],
  },
];

const filters = ref([
  // {
  //   text: "General",
  // },
  {
    text: "Played",
    subItems: [
      {
        text: "Not Played",
        icon: "mdi-close-circle-outline",
        iconActive: "mdi-close-circle",
        filterFunction(song) {
          return profile.value.songs[song.id]?.playCount == 0;
        },
      },
      {
        text: "All",
        icon: "mdi-circle-outline",
        iconActive: "mdi-circle",
        filterFunction() {
          return true;
        },
        active: true,
      },
      {
        text: "Played",
        icon: "mdi-check-circle-outline",
        iconActive: "mdi-check-circle",
        filterFunction(song) {
          return profile.value.songs[song.id]?.playCount > 0;
        },
      },
    ],
  },
  {
    text: "Favorite",
    subItems: [
      {
        text: "Not a favorite",
        icon: "mdi-close-circle-outline",
        iconActive: "mdi-close-circle",
        filterFunction(song) {
          return !profile.value.songs[song.id]?.favorite;
        },
      },
      {
        text: "All",
        icon: "mdi-circle-outline",
        iconActive: "mdi-circle",
        filterFunction() {
          return true;
        },
        active: true,
      },
      {
        text: "Is a favorite",
        icon: "mdi-check-circle-outline",
        iconActive: "mdi-check-circle",
        filterFunction(song) {
          return profile.value.songs[song.id]?.favorite;
        },
      },
    ],
  },
  {
    text: "Has Inferno",
    subItems: [
      {
        text: "No",
        icon: "mdi-close-circle-outline",
        iconActive: "mdi-close-circle",
        filterFunction(song) {
          return song.sheets.length <= 3;
        },
      },
      {
        text: "All",
        icon: "mdi-circle-outline",
        iconActive: "mdi-circle",
        filterFunction() {
          return true;
        },
        active: true,
      },
      {
        text: "Yes",
        icon: "mdi-check-circle-outline",
        iconActive: "mdi-check-circle",
        filterFunction(song) {
          return song.sheets.length > 3;
        },
      },
    ],
  },
  {
    text: "Clear Status",
  },
  {
    text: "Normal",
    subItems: [
      {
        text: "Uncleared",
        icon: "mdi-close-circle-outline",
        iconActive: "mdi-close-circle",
        filterFunction(song) {
          return (
            !profile.value.songs[song.id].scores[0] ||
            profile.value.songs[song.id].scores[0].clear_count == 0
          );
        },
      },
      {
        text: "All",
        icon: "mdi-circle-outline",
        iconActive: "mdi-circle",
        filterFunction() {
          return true;
        },
        active: true,
      },
      {
        text: "Cleared",
        icon: "mdi-check-circle-outline",
        iconActive: "mdi-check-circle",
        filterFunction(song) {
          return profile.value.songs[song.id]?.scores[0]?.clear_count > 0;
        },
      },
    ],
  },
  {
    text: "Hard",
    subItems: [
      {
        text: "Uncleared",
        icon: "mdi-close-circle-outline",
        iconActive: "mdi-close-circle",
        filterFunction(song) {
          return (
            !profile.value.songs[song.id].scores[1] ||
            profile.value.songs[song.id].scores[1].clear_count == 0
          );
        },
      },
      {
        text: "All",
        icon: "mdi-circle-outline",
        iconActive: "mdi-circle",
        filterFunction() {
          return true;
        },
        active: true,
      },
      {
        text: "Cleared",
        icon: "mdi-check-circle-outline",
        iconActive: "mdi-check-circle",
        filterFunction(song) {
          return profile.value.songs[song.id]?.scores[1]?.clear_count > 0;
        },
      },
    ],
  },
  {
    text: "Expert",
    subItems: [
      {
        text: "Uncleared",
        icon: "mdi-close-circle-outline",
        iconActive: "mdi-close-circle",
        filterFunction(song) {
          return (
            !profile.value.songs[song.id].scores[2] ||
            profile.value.songs[song.id].scores[2].clear_count == 0
          );
        },
      },
      {
        text: "All",
        icon: "mdi-circle-outline",
        iconActive: "mdi-circle",
        filterFunction() {
          return true;
        },
        active: true,
      },
      {
        text: "Cleared",
        icon: "mdi-check-circle-outline",
        iconActive: "mdi-check-circle",
        filterFunction(song) {
          return profile.value.songs[song.id]?.scores[2]?.clear_count > 0;
        },
      },
    ],
  },
  {
    text: "Inferno",
    subItems: [
      {
        text: "Uncleared",
        icon: "mdi-close-circle-outline",
        iconActive: "mdi-close-circle",
        filterFunction(song) {
          return (
            !profile.value.songs[song.id].scores[3] ||
            profile.value.songs[song.id].scores[3].clear_count == 0
          );
        },
      },
      {
        text: "All",
        icon: "mdi-circle-outline",
        iconActive: "mdi-circle",
        filterFunction() {
          return true;
        },
        active: true,
      },
      {
        text: "Cleared",
        icon: "mdi-check-circle-outline",
        iconActive: "mdi-check-circle",
        filterFunction(song) {
          return profile.value.songs[song.id]?.scores[3]?.clear_count > 0;
        },
      },
    ],
  },
]);

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

const profile = useState("profile");

const perPage = 50;
const page = ref(1);
const search = ref(null);
const activeSort = ref(sortOptions[0]);
const sortOrder = ref("asc");
const activeCategories = ref([]);

const songsFiltered = computed(() => {
  let results = [...waccaSongs];

  // category
  // no category = all categories
  let compareCategories = activeCategories.value;
  if (compareCategories.length == 0) {
    compareCategories = categories.map((category) => category.ja);
  }
  results = results.filter((song) => {
    return compareCategories.includes(song.category);
  });

  // filters
  filters.value.forEach((filter) => {
    if (filter.subItems) {
      filter.subItems.forEach((filterSub) => {
        if (filterSub.active) {
          results = results.filter(filterSub.filterFunction);
        }
      });
    }
  });

  // search
  if (search.value && search.value.length > 2) {
    // perform search
    results = fuzzysort
      .go(search.value, results, {
        keys: ["title", "artist", "titleEnglish"],
      })
      .map((result) => result.obj);
  }

  // sort
  results = results.sort(activeSort.value.sortFunction);

  return results;
});

function clickSort(sortOption) {
  if (activeSort.value.text == sortOption.text) {
    if (sortOrder.value == "asc") {
      sortOrder.value = "desc";
    } else {
      sortOrder.value = "asc";
    }
  }

  if (!sortOption.subItems) {
    sortOrder.value = sortOption.defaultSort ?? "asc";
    activeSort.value = sortOption;
  }
}

function toggleSortDirection() {
  if (sortOrder.value == "asc") {
    sortOrder.value = "desc";
  } else {
    sortOrder.value = "asc";
  }
}

function clickFilter(coFilter, coFilterSub) {
  let filter = filters.value.find((filter) => filter.text == coFilter.text);
  let filterSub = filter.subItems.find(
    (filterSub) => filterSub.text == coFilterSub.text
  );

  filter.subItems.forEach((filterSub) => {
    filterSub.active = false;
  });
  filterSub.active = true;
}

const songsPaginated = computed(() => {
  return songsFiltered.value.slice(
    (page.value - 1) * perPage,
    page.value * perPage
  );
});

// reset page to 1 if the song list changes
watch(songsFiltered, () => {
  page.value = 1;
});
</script>
