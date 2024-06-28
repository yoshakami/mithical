<template>
  <div class="gacha-item" :class="`rarity-${props.rarity}`">
    <div v-if="[5, 10, 11, 16].includes(props.kind)" class="gacha-item-preview">
      <div class="gacha-item-preview-kind">
        {{ waccaItemKinds[props.kind] }}
      </div>
      <div class="gacha-item-preview-item">
        {{ itemName(props.kind, props.id) }}
      </div>
    </div>

    <WaccaIcon
      v-else-if="props.kind == 6"
      :icon="props.id"
      class="gacha-item-preview"
    />

    <div class="gacha-item-rarity">
      <v-icon v-for="i in props.rarity" :key="i">mdi-star</v-icon>
    </div>
  </div>
</template>

<style scoped lang="scss">
.gacha-item {
  flex-grow: 0;
  flex-shrink: 0;
  color: #000;
  padding: 0px 5px;
  box-sizing: border-box;
  position: relative;
  font-size: 16px;

  background-color: #f0f0f0;
  width: 150px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  transition: box-shadow 0.1s;

  &.highlight {
    // box-shadow: 0px 0px 10px 2px rgba(var(--v-theme-primary), 0.5);
    transform: scale(1.1);
  }
}

.gacha-item-preview-kind {
  color: rgba(255, 255, 255, 0.7);
}

.gacha-item-preview {
  height: 80%;
  overflow: hidden;
}

.gacha-item-preview-item {
  font-weight: 700;
}

.gacha-item-rarity {
  position: absolute;
  bottom: 2px;

  font-size: 0.7em;
  color: #fff;
  text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.5);

  display: flex;
}

.rarity-1 {
  background-color: #009de6;
  color: white;
}

.rarity-2 {
  background-color: #fed131;
}

.rarity-3 {
  background-color: #fc06a3;
  color: white;
}

.rarity-4 {
  background-color: #4a004f;
  color: white;
}
</style>

<script setup>
import waccaIcons from "~/assets/wacca/waccaIcons.js";
import waccaSoundEffects from "~/assets/wacca/waccaSoundEffects.js";
import waccaTitles from "~/assets/wacca/waccaTitles.js";
import waccaSymbolColors from "~/assets/wacca/waccaSymbolColors.js";
import waccaUserPlates from "~/assets/wacca/waccaUserPlates.js";
import waccaItemKinds from "~/assets/wacca/waccaItemKinds.js";

const language = useState("language");

const props = defineProps({
  rarity: Number,
  kind: Number,
  id: Number,
});

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
</script>
