<template>
  <WaccaProfileRequired>
    <v-container class="box-container">
      <v-select
        v-model="selectedBox"
        :items="waccaBoxes"
        item-title="nameEnglish"
        return-object
        label="Box"
        hide-details
      />

      <WaccaGacha
        class="elevation-1 mt-4"
        ref="waccaGacha"
        :box="selectedBox"
        :received-item="receivedItem"
      ></WaccaGacha>

      <div class="mt-4">
        <v-btn @click="spin" block color="primary"
          >Gamba ({{ selectedBox.price }} RP per spin)</v-btn
        >
      </div>

      <v-container class="elevation-1 mt-4 pa-4">
        <h2 class="container-heading">Items in {{ boxName(selectedBox) }}:</h2>

        <div class="box-items">
          <div v-for="item in selectedBox.items" class="box-item">
            <WaccaGachaItem
              :kind="item.kind"
              :id="item.id"
              :rarity="item.rarity"
            />
          </div>
        </div>
      </v-container>
    </v-container>
  </WaccaProfileRequired>
</template>

<style scoped lang="scss">
.v-container {
  padding: 0;
  background: rgb(var(--v-theme-surface));
}

.container-heading {
  padding: 5px 10px;
}

.box-items {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
  justify-content: center;
}

.box-item {
  height: 100px;
  width: 120px;
}
</style>

<script setup>
import waccaBoxes from "~/assets/wacca/waccaBoxes.js";
import waccaIcons from "~/assets/wacca/waccaIcons.js";
import waccaSoundEffects from "~/assets/wacca/waccaSoundEffects.js";
import waccaTitles from "~/assets/wacca/waccaTitles.js";
import waccaSymbolColors from "~/assets/wacca/waccaSymbolColors.js";
import waccaUserPlates from "~/assets/wacca/waccaUserPlates.js";

definePageMeta({
  middleware: ["auth"],
});

const language = useState("language");
const profile = useState("profile");

const selectedBox = ref(waccaBoxes[0]);

const receivedItem = ref({});

function boxName(box) {
  if (language.value === "ja") {
    return box.name;
  } else {
    return box.nameEnglish ?? box.name;
  }
}

function findItem(kind, id) {
  if (kind == 5) {
    return waccaTitles.find((title) => title.id == id);
  } else if (kind == 6) {
    return waccaIcons.find((icon) => icon.id == id);
  } else if (kind == 10) {
    return waccaSymbolColors.find((symbolColor) => symbolColor.id == id);
  } else if (kind == 11) {
    return waccaSoundEffects.find((soundEffect) => soundEffect.id == id);
  } else if (kind == 16) {
    return waccaUserPlates.find((userPlate) => userPlate.id == id);
  }
}

function itemName(kind, id) {
  if (language.value === "ja") {
    return findItem(kind, id).name;
  } else {
    let item = findItem(kind, id);
    return item.nameEnglish ?? item.name;
  }
}

const waccaGacha = ref(null);

function spin() {
  receivedItem.value =
    selectedBox.value.items[
      Math.floor(Math.random() * selectedBox.value.items.length)
    ];

  setTimeout(() => {
    waccaGacha.value.spin();
  }, 0);
}
</script>
