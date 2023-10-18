<template>
  <WaccaProfileRequired>
    <v-container class="pa-0 waifu-holder">
      <div
        class="waifu"
        :style="{
          backgroundImage: `url(/wacca/img/navigators/${navigator.path}.webp)`,
        }"
      ></div>
    </v-container>
    <v-container>
      <div class="profile-name">
        <div class="profile-icon">
          <WaccaIcon :icon="iconId" />
        </div>
        <WaccaProfileBox>
          <span class="light">Welcome back</span>
          {{ profile.user_name }}
        </WaccaProfileBox>
      </div>

      <WaccaProfileBox>
        <div class="profile-stat mr-5">
          <span class="light">Level</span> {{ level }}
        </div>
        <div class="profile-stat mr-5">
          <span class="light">Rate</span>&nbsp;<span
            :class="`rating-${ratingColor}`"
            >{{ realRate }}</span
          >
        </div>
        <div class="profile-stat">
          <span class="light">Points</span> {{ profile.points }}
        </div>
      </WaccaProfileBox>
    </v-container>
  </WaccaProfileRequired>
</template>

<style scoped lang="scss">
.waifu-holder {
  position: relative;
  pointer-events: none;
}

.waifu {
  position: absolute;
  $size: 0.7;

  width: 2048px * $size;
  height: 2048px * $size;
  background-size: contain;
  background-position: center;
  overflow: hidden;
  top: -100px;
  right: -600px;
}

.profile-name {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  .profile-icon {
    height: 150px;
    width: 150px;
    margin-right: -40px;
    z-index: 2;

    img {
      height: 100%;
    }
  }

  :deep(.profile-box) {
    padding-left: 50px;
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

.rating-silver {
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

.rating-gold {
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

.rating-rainbow {
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

.light {
  font-weight: 200;
}

@keyframes rate_animation {
  0%,
  100% {
    background-position: 0 0;
  }

  50% {
    background-position: 100% 0;
  }
}
</style>

<script setup>
import waccaNavigators from "~/assets/wacca/waccaNavigators.js";

const ratingColors = [
  { from: 0, color: "white" },
  { from: 300, color: "darkblue" },
  { from: 600, color: "yellow" },
  { from: 1000, color: "red" },
  { from: 1300, color: "purple" },
  { from: 1600, color: "blue" },
  { from: 1900, color: "silver" },
  { from: 2200, color: "gold" },
  { from: 2500, color: "rainbow" },
];

definePageMeta({
  middleware: ["auth"],
});

const profile = useState("profile");

const level = computed(() => {
  return Math.floor(profile.value.exp / 100) + 1;
});

const realRate = computed(() => {
  return (profile.value.rating ?? 0) / 10;
});

const ratingColor = computed(() => {
  for (let i = ratingColors.length - 1; i >= 0; i--) {
    if (realRate.value >= ratingColors[i].from) {
      return ratingColors[i].color;
    }
  }
});

const navigator = computed(() => {
  let navigatorId =
    profile.value.options.find((option) => {
      return option.option_id == 1004;
    })?.value || 310001;

  return waccaNavigators.find((n) => n.id === navigatorId);
});

const iconId = computed(() => {
  let iconId = profile.value.options.find((option) => {
    return option.option_id == 1003;
  })?.value;

  return iconId ?? 102001;
});
</script>
