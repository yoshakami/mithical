<template>
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
</template>

<style scoped lang="scss">
.gacha-border {
  position: relative;
  overflow: hidden;

  width: 100%;
  padding: 10px;
}

.gacha-holder {
  height: 100px;
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
  background: rgb(var(--v-theme-primary));
  opacity: 0.8;
}
</style>

<script setup>
const props = defineProps({
  box: Object,
  receivedItem: Object,
});

const position = 40;
const itemWidth = 130;

const itemList = ref([]);

function updateItemList() {
  // clone the box.items
  itemList.value = props.box.items.map((item) => ({ ...item }));
  // randomize order
  itemList.value.sort(() => Math.random() - 0.5);
  // remove received item from list
  itemList.value.splice(
    itemList.value.findIndex((item) => item.id === props.receivedItem.id),
    1
  );

  // insert random items until we have at least 45
  while (itemList.value.length < 45) {
    const randomItem =
      props.box.items[Math.floor(Math.random() * props.box.items.length)];
    itemList.value.push({ ...randomItem });
  }

  // insert received item at position
  itemList.value.splice(position, 0, props.receivedItem);
}

let scrollDistance;

const offset = ref(0);
const rouletteRef = ref(null);
let spinTimer;
let spinStartTime;
const spinTime = 6;

function spin() {
  updateItemList();

  // reset offset in css
  offset.value = 0;

  scrollDistance = position * itemWidth + Math.random() * 130;

  spinTimer = 0;
  spinStartTime = null;
  requestAnimationFrame(animateSpin);
}

const currentRouletteItem = ref(0);
let lastRouletteItem = 0;

const rouletteClickSound = [new Audio("/wacca/sound/rouletteclick.wav")];
rouletteClickSound[0].volume = 0.5;
const rouletteClickCount = 5;
for (let i = 1; i < rouletteClickCount; i++) {
  rouletteClickSound[i] = rouletteClickSound[0].cloneNode();
  rouletteClickSound[i].volume = 0.5;
}

let lastSound = 0;

function animateSpin(currentTime) {
  if (spinTimer < spinTime) {
    if (!spinStartTime) {
      spinStartTime = currentTime;
    }

    spinTimer = Math.min(spinTime, (currentTime - spinStartTime) / 1000);

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
      lastSound = (lastSound + 1) % rouletteClickCount;
      rouletteClickSound[lastSound].currentTime = 0;
      rouletteClickSound[lastSound].play();
    }

    requestAnimationFrame(animateSpin);
  }
}

defineExpose({ spin });
</script>
