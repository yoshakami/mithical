<template>
  <div>
    <v-container class="pa-0 waifu-holder">
      <div
        class="waifu"
        :style="{
          backgroundImage:
            'url(/wacca/navigators/navigator_' + profile.navigator + '.png)',
        }"
      ></div>
    </v-container>
    <v-container>
      <WaccaProfileBox
        ><span class="light">Welcome back</span> {{ profile.user_name
        }}<span class="light">!</span></WaccaProfileBox
      >

      <WaccaProfileBox
        ><span class="light">Level</span>
        {{ Math.floor(profile.exp / 100) + 1 }}</WaccaProfileBox
      >

      <WaccaProfileBox
        ><span class="light">Rate</span> {{ profile.rating }}</WaccaProfileBox
      >

      <WaccaProfileBox
        ><span class="light">Points</span> {{ profile.points }}</WaccaProfileBox
      >
    </v-container>
  </div>
</template>

<script setup>
const profile = useState("profile");
</script>
