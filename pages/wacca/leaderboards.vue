<template>
  <WaccaProfileRequired>
    <v-container class="elevation-1 mt-4 pa-0">
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
              <th>Rating</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(profile, i) in leaderboardsDataFiltered" :key="i">
              <td class="text-right">
                <span
                  v-if="
                    i == 0 ||
                    leaderboardsDataFiltered[i - 1].rating != profile.rating
                  "
                >
                  {{ i + 1 }}
                </span>
                <span v-else>=</span>
              </td>
              <td>
                <WaccaIcon
                  class="leaderboard-icon"
                  :icon="profile.user_icon_id"
                />
                {{ profile.user_name }}
              </td>
              <td>
                <WaccaRating
                  class="rating"
                  :rating="profile.rating"
                  :simple="i >= 10"
                />
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </v-container>
  </WaccaProfileRequired>
</template>

<style scoped lang="scss">
.leaderboard-icon {
  height: 40px;
  vertical-align: middle;
}

.rating {
  vertical-align: middle;
  font-weight: 700;
  font-size: 2em;
}

:deep(.rating-white) {
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
}
</style>

<script setup>
definePageMeta({
  middleware: ["auth"],
});

const leaderboardsLoading = ref(false);
const leaderboardsLoadingError = ref();
const runtimeConfig = useRuntimeConfig();
const leaderboardData = ref([]);

function loadData() {
  leaderboardsLoading.value = ref(true);
  $fetch(`${runtimeConfig.public.apiUrl}/wacca/user/leaderboards`)
    .then((data) => {
      leaderboardsLoading.value = false;
      leaderboardData.value = data;
    })
    .catch((err) => {
      leaderboardsLoading.value = false;
      leaderboardsLoadingError.value =
        "Couldn't reach the API. Please try again later.";
    });
}

const version = useState("version");

const leaderboardsDataFiltered = computed(() => {
  let reverseOnly = leaderboardData.value.filter(
    (profile, i) => profile.version == version.value - 1
  );

  let withoutDuplicates = reverseOnly.filter(
    (profile, i) =>
      reverseOnly.findIndex((p) => p.api_id == profile.api_id) == i
  );

  return withoutDuplicates;
});

loadData();
</script>
