<template>
  <!-- <v-tooltip location="start">
    <template v-slot:activator="{ props }"> -->
  <v-btn
    icon
    @click.prevent="toggleFavorite"
    variant="plain"
    v-bind="props"
    size="x-large"
  >
    <v-icon color="yellow" size="50">{{
      profileSong.favorite ? "mdi-star" : "mdi-star-outline"
    }}</v-icon>
  </v-btn>
  <!-- </template>
    <span>{{ profileSong.favorite ? "Remove favorite" : "Add favorite" }}</span>
  </v-tooltip> -->
</template>

<script setup>
const runtimeConfig = useRuntimeConfig();

const props = defineProps({
  songId: Number,
});

const activeCard = useState("activeCard");
const profile = useState("profile");

const profileSong = computed(() => {
  if (!profile.value) {
    return {
      favorite: false,
    };
  }
  return profile.value.songs[props.songId];
});

async function toggleFavorite() {
  profile.value.songs[props.songId].favorite =
    !profile.value.songs[props.songId].favorite;

  await $fetch(
    `${runtimeConfig.public.apiUrl}/wacca/user/${activeCard.value}/favorites/${props.songId}/toggle`,
    {
      method: "POST",
    }
  );
}
</script>
