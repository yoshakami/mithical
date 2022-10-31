<template>
  <WaccaProfileRequired>
    <v-container class="pa-0 waifu-holder">
      <div
        class="waifu"
        :style="{
          backgroundImage: `url(/wacca/img/navigators/${navigator.path}.png)`,
        }"
      ></div>
    </v-container>
    <v-container>
      <div class="profile-name">
        <div class="profile-icon">
          <img :src="`/wacca/img/icons/${icon.path}.png`" />
        </div>
        <WaccaProfileBox
          ><span class="light">Welcome back</span> {{ profile.user_name
          }}<span class="light">!</span></WaccaProfileBox
        >
      </div>

      <WaccaProfileBox>
        <div class="profile-stat mr-5">
          <span class="light">Level</span> {{ level }}
        </div>
        <div class="profile-stat mr-5">
          <span class="light">Rate</span> {{ realRate }}
        </div>
        <div class="profile-stat">
          <span class="light">Points</span> {{ profile.points }}
        </div>
      </WaccaProfileBox>
    </v-container>
  </WaccaProfileRequired>
</template>

<script setup>
import waccaNavigators from "~/assets/wacca/waccaNavigators.js";
import waccaIcons from "~/assets/wacca/waccaIcons.js";

definePageMeta({
  middleware: ["auth"],
});

const profile = useState("profile");

const level = computed(() => {
  return Math.floor(profile.value.exp / 100) + 1;
});

const realRate = computed(() => {
  return Math.floor(profile.value.rating / 10);
});

const navigator = computed(() => {
  let navigatorId = profile.value.options.find((option) => {
    return option.option_id == 1004;
  }).value;

  return waccaNavigators.find((n) => n.id === navigatorId);
});

const icon = computed(() => {
  let iconId = profile.value.options.find((option) => {
    return option.option_id == 1003;
  }).value;

  return waccaIcons.find((i) => i.id === iconId);
});
</script>
