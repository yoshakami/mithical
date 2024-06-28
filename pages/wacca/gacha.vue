<template>
  <WaccaProfileRequired>
    <h1 class="text-center">Your current balance: {{ profile.points }} RP</h1>

    <WaccaGacha
      v-for="box of waccaBoxes"
      class="mt-4"
      ref="waccaGacha"
      :box="box"
    />
  </WaccaProfileRequired>
</template>

<script setup>
import waccaBoxes from "~/assets/wacca/waccaBoxes.js";

definePageMeta({
  middleware: ["auth"],
});

const profile = useState("profile");
</script>
