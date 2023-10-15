<template>
  <div class="song-difficulty-pill" :class="`song-difficulty-${i}`">
    <div class="song-difficulty-name">
      {{ waccaDifficulties.find((d) => d.id === i).name }}
    </div>

    <div class="song-difficulty-level">
      {{ formatDifficulty(difficulty, difficultyInternal) }}
    </div>
  </div>
</template>

<script setup>
import { formatDifficulty } from "~/assets/js/util";
const difficultyInternal = useState("difficultyInternal");
import waccaDifficulties from "~/assets/wacca/waccaDifficulties";

const props = defineProps({
  i: Number,
  difficulty: Number,
});
</script>
