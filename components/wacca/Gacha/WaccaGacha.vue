<template>
  <v-container
    class="box-container mb-16 elevation-1 rounded-xl"
    :style="{ 'background-color': box.color }"
  >
    <div class="polka-dots"></div>

    <div
      class="box-image"
      :style="{
        'background-image': `url(${box.image})`,
      }"
    ></div>

    <div class="pa-4">
      <h1 class="text-h1">{{ boxName(box) }}</h1>
    </div>

    <div class="gacha-border">
      <div class="gacha-holder">
        <div class="gacha-roulette" ref="rouletteRef">
          <WaccaGachaItem
            v-for="(item, i) in itemList"
            :rarity="item.rarity"
            :kind="item.kind"
            :id="item.id"
            ref="itemsRefs"
            :class="{ highlight: i === currentRouletteItem }"
          />
        </div>
      </div>
      <div class="gacha-line"></div>
    </div>

    <div class="pa-4">
      <div class="gamba-button">
        <v-btn
          @click="spin(i)"
          color="primary"
          size="x-large"
          :disabled="!spinReady"
        >
          Gamba ({{ box.price }} RP per spin)
        </v-btn>
      </div>
      <v-expansion-panels class="mt-4">
        <v-expansion-panel title="Available items">
          <v-expansion-panel-text>
            <div class="box-items">
              <div v-for="item in box.items" class="box-item">
                <WaccaGachaItem
                  :kind="item.kind"
                  :id="item.id"
                  :rarity="item.rarity" />
              </div>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>


    <div class="item-popup"
      :class="{ active: resultOpen }"
      @click="closeResult"
    >
      <div class="item-popup-inner">
        <div class="item-popup-congrats">Item get!</div>
        <div class="item-popup-item">
          <WaccaGachaItem
            :kind="receivedItem.kind"
            :id="receivedItem.id"
            :rarity="receivedItem.rarity"
          />
        </div>
      </div>
    </div>
  </v-container>
</template>

<style scoped lang="scss">
.box-container {
  color: white;
  position: relative;
  overflow: hidden;
}

.polka-dots {
  position: absolute;
  top: -300px;
  left: -300px;

  width: 2000px;
  height: 2000px;

  background: url("/wacca/img/gacha-background.png") repeat no-repeat;
  background-size: 40px;
  transform: rotate(-20deg);
  opacity: 0.4;
  z-index: 0;
}

.box-image {
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  background-size: 400px;
  background-position: top right;
}

h1 {
  position: relative;
  text-shadow: black 0px 0px 10px;
}

.gacha-border {
  background: rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;

  width: 100%;
  padding: 10px;

  mask-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 1) 10%,
    rgba(0, 0, 0, 1) 90%,
    rgba(0, 0, 0, 0)
  );
}

.gacha-holder {
  height: 120px;
  width: 100%;
  transform: translateX(50%);
}

.gacha-roulette {
  display: flex;
  gap: 10px;
  padding-left: 5px;
  padding-right: 5px;
  height: 100%;
  width: 100%;
}

.gacha-line {
  position: absolute;
  top: 0px;
  left: 50%;
  width: 3px;
  height: 100%;
  transform: translateX(-50%);
  background: white;
  opacity: 0.8;
}

.container-heading {
  padding: 5px 10px;
}

.gamba-button {
  display: flex;
  justify-content: center;
}

.box-items {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
  justify-content: center;
}

.box-item {
  height: 120px;
  width: 150px;
}

.item-popup {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1;
  font-size: 2em;

  opacity: 0;
  transition: all 0.3s;
  z-index: -1;

  &.active {
    z-index: 1000;
    opacity: 1;

    .item-popup-inner {
      transform: translateY(0);
    }
  }

  .item-popup-inner {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 400px;

    transform: translateY(-30px);
    transition: transform 0.3s;
  }

  .item-popup-item {
    margin: 1.4em 0;
    transform: scale(1.5);
  }
}
</style>

<script setup>
import { Howl } from "howler";

const language = useState("language");
const profile = useState("profile");

const props = defineProps({
  box: Object,
});

const itemList = ref([]);
const receivedItem = ref(props.box.items[0]);

const position = 40;
const itemWidth = 160;

function updateItemList() {
  // clone the box.items
  itemList.value = props.box.items.map((item) => ({ ...item }));
  // randomize order
  itemList.value.sort(() => Math.random() - 0.5);
  // remove received item from list
  itemList.value.splice(
    itemList.value.findIndex((item) => item.id === receivedItem.value.id),
    1
  );

  // insert random items until we have at least 45
  while (itemList.value.length < 45) {
    const randomItem =
      props.box.items[Math.floor(Math.random() * props.box.items.length)];
    itemList.value.push({ ...randomItem });
  }

  // insert received item at position
  itemList.value.splice(position, 0, receivedItem.value);
}

let scrollDistance;

const offset = ref(0);
const rouletteRef = ref(null);
let spinTimer;
let spinStartTime;
const spinTime = 6;
const spinReady = ref(true);

function spin() {
  spinReady.value = false;
  receivedItem.value =
    props.box.items[Math.floor(Math.random() * props.box.items.length)];
  updateItemList();

  // reset offset in css
  offset.value = 0;

  scrollDistance = position * itemWidth + Math.random() * 130;

  spinTimer = 0;
  spinStartTime = null;

  profile.value.points -= props.box.price;

  requestAnimationFrame(animateSpin);
}

const currentRouletteItem = ref(0);
let lastRouletteItem = 0;

const rouletteClickSound = new Howl({
  src: "/wacca/sound/rouletteclick.wav",
  volume: 0.5,
});

const rouletteGetSound = new Howl({
  src: "/wacca/sound/rouletteget.wav",
  volume: 0.5,
});

function animateSpin(currentTime) {
  if (spinTimer < spinTime) {
    if (!spinStartTime) {
      spinStartTime = currentTime;
    }

    spinTimer = (currentTime - spinStartTime) / 1000;

    if (spinTimer >= spinTime) {
      rouletteGetSound.play();
      spinTimer = spinTime;
      resultOpen.value = true;
    }

    const progress = spinTimer / spinTime;
    // console.log(progress);
    const progressEased = 1 - Math.pow(1 - progress, 4);

    offset.value = (scrollDistance + 1000) * progressEased - 1000;

    rouletteRef.value.style.transform = `translateX(${-offset.value}px)`;

    const currentItem = Math.floor(offset.value / itemWidth);
    currentRouletteItem.value = currentItem;

    // play clicking noise if the item switched
    if (currentItem >= 0 && currentItem !== lastRouletteItem) {
      lastRouletteItem = currentItem;

      // play sound
      rouletteClickSound.play();
    }

    if (spinTimer < spinTime) {
      requestAnimationFrame(animateSpin);
    }
  }
}

defineExpose({ spin });

function boxName(box) {
  if (language.value === "ja") {
    return box.name;
  } else {
    return box.nameEnglish ?? box.name;
  }
}

const resultOpen = ref(false);

function closeResult() {
  resultOpen.value = false;
  spinReady.value = true;
}
</script>
