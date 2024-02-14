<template>
  <WaccaProfileRequired>
    <v-container>
      <v-tabs fixed-tabs v-model="tab" bg-color="primary">
        <v-tab v-for="(folder, i) in songFolders" :key="i">
          {{ folder.name }}
          <v-chip>{{ folder.count }}</v-chip>
        </v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <div v-for="(folder, i) in songFolders" :key="i" v-show="tab == i">
          <div class="rating-holder">
            <div v-for="(song, j) in folder.songs" :key="song.id">
              <NuxtLink
                style="text-decoration: none"
                :to="`/wacca/songs/${song.id}`"
                class="rating-song"
              >
                <div class="rating-jacket">
                  <WaccaJacket :url="song.imageName" />
                </div>

                <div class="rating-info">
                  <div class="rating-title">
                    {{ getTitle(song) }}
                  </div>

                  <div class="rating-right">
                    <div
                      class="rating-rating"
                      :class="`difficulty-${highestDiff[song.id]}`"
                    >
                      {{ formatRating(profile.songs[song.id].rating) }}
                    </div>
                  </div>
                </div>
              </NuxtLink>
              <div v-if="j == folder.count - 1" class="cutoff">
                <v-icon>mdi-content-cut</v-icon>
                Cutoff
                <v-icon>mdi-content-cut mdi-rotate-180</v-icon>
              </div>
            </div>
          </div>
        </div>
      </v-window>
    </v-container>
  </WaccaProfileRequired>
</template>

<style scoped lang="scss">
.rating-holder {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 10px 0;
}

.rating-song {
  color: var(--v-text-primary);
  display: flex;
  border-radius: 5px;
  border: 1px solid #333;
  background: rgb(var(--v-theme-surface));
  height: 50px;
  overflow: hidden;
}

.rating-info {
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rating-jacket {
  height: 100%;
  aspect-ratio: 1;
  flex-shrink: 1;
}

.rating-title {
  padding: 10px;
}

.rating-rating {
  padding: 10px;
  font-weight: 700;

  &.difficulty-1 {
    color: #009de6;
  }

  &.difficulty-2 {
    color: #fed131;
  }

  &.difficulty-3 {
    color: #fc06a3;
  }

  &.difficulty-4 {
    color: #4a004f;
  }
}

.cutoff {
  display: flex;
  align-items: center;
  color: rgba(var(--v-theme-on-background), 0.5);
  gap: 10px;
  margin: 20px 0;
  font-size: 1.5em;
  font-weight: 400;

  &:before,
  &:after {
    content: "";
    flex-grow: 1;
    background: rgba(var(--v-theme-on-background), 0.5);
    height: 1px;
    font-size: 0px;
    line-height: 0px;
  }
}
</style>

<script setup>
import waccaSongs from "~/assets/wacca/waccaSongs.js";

const language = useState("language");
const profile = useState("profile");

definePageMeta({
  middleware: ["auth"],
});

const tab = ref(0);
const highestDiff = [];

const songFolders = computed(() => {
  console.log("Calculcating songfolders");
  const folders = [
    {
      name: "Previous versions",
      songs: [],
      count: 35,
    },
    {
      name: "Wacca Reverse",
      songs: [],
      count: 15,
    },
  ];

  for (const song of waccaSongs) {
    if (song.gameVersion < 5) {
      folders[0].songs.push(song);
    } else {
      folders[1].songs.push(song);
    }

    highestDiff[song.id] = findHighestRatingDifficulty(song);
  }

  // sort by rating
  for (const folder of folders) {
    folder.songs.sort((a, b) => {
      return (
        profile.value.songs[b.id].rating - profile.value.songs[a.id].rating
      );
    });
  }

  // trim array for performance reasons
  // for (const folder of folders) {
  //   folder.songs = folder.songs.slice(0, folder.count * 2);
  // }

  return folders;
});

function findHighestRatingDifficulty(song) {
  console.log("finding highest diff");
  for (const score of profile.value.songs[song.id].scores) {
    if (score != null) {
      if (score.rating == profile.value.songs[song.id].rating) {
        return score.music_difficulty;
      }
    }
  }
}

function formatRating(rating) {
  return (rating / 10).toFixed(1);
}

const ratingBorders = [
  {
    min: 990000,
    multiplier: 4,
  },
  {
    min: 980000,
    multiplier: 3.75,
  },
  {
    min: 970000,
    multiplier: 3.5,
  },
  {
    min: 960000,
    multiplier: 3.25,
  },
  {
    min: 950000,
    multiplier: 3,
  },
  {
    min: 940000,
    multiplier: 2.75,
  },
  {
    min: 920000,
    multiplier: 2.5,
  },
  {
    min: 900000,
    multiplier: 2,
  },
  {
    min: 850000,
    multiplier: 1.5,
  },
  {
    min: 800000,
    multiplier: 1,
  },
  {
    min: 700000,
    multiplier: 0.8,
  },
  {
    min: 600000,
    multiplier: 0.7,
  },
  {
    min: 500000,
    multiplier: 0.6,
  },
  {
    min: 400000,
    multiplier: 0.5,
  },
  {
    min: 300000,
    multiplier: 0.4,
  },
  {
    min: 200000,
    multiplier: 0.3,
  },
  {
    min: 100000,
    multiplier: 0.2,
  },
  {
    min: 1,
    multiplier: 0.1,
  },
  {
    min: 0,
    multiplier: 0,
  },
];

function getTitle(song) {
  if (language.value === "ja") {
    return song.title;
  }

  return song.titleEnglish || song.title;
}

function calculateRating(score, difficulty) {
  const border = ratingBorders.find((border) => score >= border.min);
  return difficulty * border.multiplier;
}
</script>
