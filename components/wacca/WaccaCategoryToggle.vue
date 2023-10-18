<template>
  <div class="song-category" v-ripple :class="{ active }">
    <div
      class="song-category-image"
      :style="{
        backgroundImage: `url(/wacca/img/categories/${category.img})`,
        backgroundColor: category.color,
      }"
    ></div>
    <div class="song-category-info">
      <div class="song-category-title">
        {{ language == "ja" ? category.ja : category.en }}
      </div>
      <!-- <div class="song-category-count">
        {{ category.count }}
      </div> -->
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  category: Object,
  activeCategories: Array,
  language: String,
});

const active = computed(() => {
  return props.activeCategories.includes(props.category.ja);
});
</script>
