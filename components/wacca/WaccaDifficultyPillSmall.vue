<template>
  <div class="song-difficulty-pill" :class="`song-difficulty-${i}`">
    {{ text }}
  </div>
</template>

<style scoped lang="scss">
.song-difficulty-pill {
  font-weight: bold;
  color: white;

  &.song-difficulty-1 {
    background-color: #009de6;
  }

  &.song-difficulty-2 {
    background-color: #fed131;
  }

  &.song-difficulty-3 {
    background-color: #fc06a3;
  }

  &.song-difficulty-4 {
    background-color: #4a004f;
  }

  font-size: 1rem;
  text-transform: uppercase;
  padding: 2px 7px;
}
</style>

<script setup>
import { formatDifficulty } from "~/assets/js/util";
const difficultyInternal = useState("difficultyInternal");
import waccaDifficulties from "~/assets/wacca/waccaDifficulties";

const props = defineProps({
  i: Number,
  difficulty: Number,
});

const text = computed(() => {
  return `${waccaDifficulties
    .find((d) => d.id === props.i)
    .name.toUpperCase()
    .slice(0, 3)} ${formatDifficulty(
    props.difficulty,
    difficultyInternal.value,
    true
  )}`;
});
</script>
