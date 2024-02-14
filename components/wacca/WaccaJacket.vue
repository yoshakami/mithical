<template>
  <v-img :src="fullUrl" />
</template>

<script setup>
const props = defineProps({
  url: String,
});

const fullUrl = computed(() => {
  return `/wacca/img/covers/${props.url}`;
});
</script>
