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

                  <div
                    v-for="potential in ratingPotentials[song.id]"
                    class="rating-suggestion"
                    :class="`difficulty-${potential.difficulty}`"
                    v-if="profile.songs[song.id].rating"
                  >
                    <div>
                      {{
                        waccaDifficulties[potential.difficulty].name
                          .toUpperCase()
                          .slice(0, 3)
                      }}
                      +{{ potential.scoreDiff }}
                    </div>
                    <div>
                      R +{{ potential.ratingDiff.toFixed(1) }} / +{{
                        Math.max(0, potential.ratingGain.toFixed(1))
                      }}
                    </div>
                  </div>
                  <div
                    class="rating-difficulty"
                    v-if="profile.songs[song.id].rating"
                  >
                    <WaccaDifficultyPillSmall
                      :i="highestDiff[song.id]"
                      :difficulty="song.sheets[highestDiff[song.id] - 1]"
                    />
                  </div>
                  <div
                    class="rating-rating"
                    v-if="profile.songs[song.id].rating"
                  >
                    <WaccaRating
                      :rating="profile.songs[song.id].rating"
                      :divide="50"
                      :simple="true"
                    />
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
  overflow: hidden;
}

.rating-info {
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding: 10px;
  gap: 10px;
}

.rating-jacket {
  height: 60px;
  aspect-ratio: 1;
  flex-shrink: 1;
}

.rating-title {
  flex-grow: 1;
}

.rating-rating {
  font-weight: 700;
  font-size: 1.5em;
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

.rating-suggestion {
  font-size: 0.8em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &.difficulty-0 {
    color: #009de6;
  }

  &.difficulty-1 {
    color: #fed131;
  }

  &.difficulty-2 {
    color: #fc06a3;
  }

  &.difficulty-3 {
    color: #4a004f;
  }
}
</style>

<script setup>
import waccaSongs from "~/assets/wacca/waccaSongs.js";
import waccaDifficulties from "~/assets/wacca/waccaDifficulties";
import waccaRateMulBorders from "~/assets/wacca/waccaRateMulBorders";

const language = useState("language");
const profile = useState("profile");

definePageMeta({
  middleware: ["auth"],
});

const tab = ref(0);
const highestDiff = [];
const ratingPotentials = [];

const songFolders = computed(() => {
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

  // calculate rating potentials
  for (const song of waccaSongs) {
    ratingPotentials[song.id] = [];

    for (let difficulty = 0; difficulty < song.sheets.length; difficulty++) {
      // find next rating border
      let nextBorder;

      for (let i = waccaRateMulBorders.length - 1; i >= 0; i--) {
        const border = waccaRateMulBorders[i];
        const rating = border.multiplier * song.sheets[difficulty];

        if (
          border.min > profile.value.songs[song.id].scores[difficulty]?.score &&
          rating > profile.value.songs[song.id].rating / 10
        ) {
          nextBorder = border;
          break;
        }
      }

      if (nextBorder) {
        const songFolder = song.gameVersion < 5 ? folders[0] : folders[1];
        const lowestRating =
          profile.value.songs[songFolder.songs[songFolder.count - 1].id]
            .rating / 10;

        const ratingDiff =
          nextBorder.multiplier * song.sheets[difficulty] -
          profile.value.songs[song.id].rating / 10;

        let ratingGain =
          nextBorder.multiplier * song.sheets[difficulty] - lowestRating;

        if (profile.value.songs[song.id].rating / 10 >= lowestRating) {
          ratingGain = ratingDiff;
        }

        ratingPotentials[song.id].push({
          difficulty,
          score: nextBorder.min,
          scoreDiff:
            nextBorder.min -
            profile.value.songs[song.id].scores[difficulty]?.score,
          rating: nextBorder.multiplier * song.sheets[difficulty],
          ratingDiff,
          ratingGain,
        });
      }
    }
  }

  // trim array for performance reasons
  // for (const folder of folders) {
  //   folder.songs = folder.songs.slice(0, folder.count * 2);
  // }

  return folders;
});

function findHighestRatingDifficulty(song) {
  for (const score of profile.value.songs[song.id].scores) {
    if (score != null) {
      if (score.rating == profile.value.songs[song.id].rating) {
        return score.music_difficulty;
      }
    }
  }
}

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
