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
          <div>
            <span class="light">Welcome back</span>
            {{ profile.user_name }}
          </div>
        </WaccaProfileBox>
      </div>

      <WaccaProfileBox>
        <div class="profile-stat mr-5">
          <span class="light">Level</span> {{ level }}
        </div>
        <div class="profile-stat mr-5">
          <span class="light">RP</span> {{ profile.points }}
        </div>
        <div class="profile-stat">
          <span class="light">Rate</span>&nbsp;<WaccaRating
            :rating="profile.version_data[4].rating"
          />
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
  background-position: 40% top;
  overflow: hidden;
  top: 0px;
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

.light {
  font-weight: 200;
}
</style>

<script setup>
import waccaNavigators from "~/assets/wacca/waccaNavigators.js";

definePageMeta({
  middleware: ["auth"],
});

const profile = useState("profile");

const level = computed(() => {
  return Math.floor(profile.value.exp / 100) + 1;
});

const navigator = computed(() => {
  let navigatorId = profile.value.options[1004] || 310001;

  return waccaNavigators.find((n) => n.id === navigatorId);
});

const iconId = computed(() => {
  let iconId = profile.value.options[1003] ?? 102001;

  return iconId;
});
</script>
