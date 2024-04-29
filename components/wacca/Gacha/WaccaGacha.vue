<template>
  <div class="gacha-border">
    <div class="gacha-holder">
      <div class="gacha-roulette" ref="roulette">
        <WaccaGachaItem
          v-for="item of itemList"
          :rarity="item.rarity"
          :kind="item.kind"
          :id="item.id"
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
  background: rgb(var(--v-theme-surface));

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

  transition: transform 6s cubic-bezier(0.25, 1, 0.5, 1);
  transform: translateX(v-bind(offsetPx));
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
const offsetPx = computed(() => `${-offset.value}px`);

const offset = ref(-1000);
const roulette = ref(null);

function spin() {
  updateItemList();

  // reset offset in css
  offset.value = -1000;
  roulette.value.style.transition = "none";

  scrollDistance = position * itemWidth + Math.random() * 130;

  setTimeout(() => {
    roulette.value.style.transition =
      "transform 6s cubic-bezier(0.25, 1, 0.5, 1)";
    offset.value = scrollDistance;
  }, 100);
}

defineExpose({ spin });
</script>
