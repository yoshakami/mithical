<template>
  <img :src="url" />
</template>

<script setup>
const props = defineProps({
  grade: Number,
});

const url = computed(() => `/wacca/img/grades/${props.grade}.png`);
</script>
