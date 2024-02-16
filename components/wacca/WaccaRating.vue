<template>
  <span :class="[`rating-${ratingColor}`, { simple }]">{{
    realRateFormatted
  }}</span>
</template>

<style scoped lang="scss">
@keyframes rate_animation {
  0%,
  100% {
    background-position: 0 0;
  }

  50% {
    background-position: 100% 0;
  }
}

@mixin animate {
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: rate_animation 6s ease-in-out infinite;
  background-size: 400% 100%;
}

.profile-stat {
  display: inline-block;
}

.rating-white {
  color: white;
}

.rating-darkblue {
  color: #1005de;
}

.rating-yellow {
  color: #fffc48;
}

.rating-red {
  color: #fc0606;
}

.rating-purple {
  color: #a000ac;
}

.rating-blue {
  color: #009de6;
}

.rating-silver.simple {
  color: #b7b7b7;
}

.rating-gold.simple {
  color: #bf953f;
}

.rating-rainbow.simple {
  color: violet;
}

.rating-silver:not(.simple) {
  @include animate;

  background-image: repeating-linear-gradient(
    -70deg,
    #b7b7b7,
    #f6f6f6,
    #8a8a8a,
    #f5f5f5,
    #828282
  );
}

.rating-gold:not(.simple) {
  @include animate;

  background-image: repeating-linear-gradient(
    -70deg,
    #bf953f,
    #fcf6ba,
    #b38728,
    #fbf5b7,
    #aa771c
  );
}

.rating-rainbow:not(.simple) {
  @include animate;

  background-image: repeating-linear-gradient(
    -70deg,
    violet,
    indigo,
    blue,
    green,
    yellow,
    orange,
    red,
    violet
  );
}
</style>

<script setup>
const ratingColors = [
  { from: 2500, color: "rainbow" },
  { from: 2200, color: "gold" },
  { from: 1900, color: "silver" },
  { from: 1600, color: "blue" },
  { from: 1300, color: "purple" },
  { from: 1000, color: "red" },
  { from: 600, color: "yellow" },
  { from: 300, color: "darkblue" },
  { from: 0, color: "white" },
];

const props = defineProps({
  rating: Number,
  divide: Number,
  simple: Boolean,
});

const realRate = computed(() => {
  return (props.rating ?? 0) / 10;
});

const realRateFormatted = computed(() => {
  return realRate.value.toFixed(1);
});

const ratingColor = computed(() => {
  return ratingColors.find(
    (color) => realRate.value >= color.from / (props.divide ?? 1)
  ).color;
});
</script>
