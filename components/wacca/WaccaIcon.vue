<template>
  <img :src="url" />
</template>

<script setup>
import waccaIcons from "~/assets/wacca/waccaIcons.js";

const props = defineProps({
  icon: Number,
});

const url = computed(() => {
  let icon = waccaIcons.find((i) => i.id === props.icon);
  return `/wacca/img/icons/${icon.path}.webp`;
});
</script>
