<template>
  <WaccaProfileRequired>
    <v-container>
      <v-btn-toggle v-model="activeCategory" shaped mandatory>
        <v-btn
          color="primary"
          v-for="category of categories"
          :key="category.id"
        >
          {{ category.name }}
        </v-btn>
      </v-btn-toggle>

      <div>
        <h1>{{ categories[activeCategory].name }}</h1>

        <div class="box-items">
          <div
            v-for="item in categories[activeCategory].items"
            :key="item.id"
            class="box-item"
          >
            <tippy
              placement="bottom"
              max-width="none"
              :content="getTooltip(categories[activeCategory], item)"
            >
              <WaccaGachaItem
                :kind="categories[activeCategory].id"
                :id="item.id"
                :rarity="0"
                greyunowned
              />
            </tippy>
          </div>
        </div>
      </div>
    </v-container>
  </WaccaProfileRequired>
</template>

<style scoped lang="scss">
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
</style>

<script setup>
import waccaIcons from "~/assets/wacca/waccaIcons.js";
import waccaSoundEffects from "~/assets/wacca/waccaSoundEffects.js";
import waccaTitles from "~/assets/wacca/waccaTitles.js";
import waccaSymbolColors from "~/assets/wacca/waccaSymbolColors.js";
import waccaUserPlates from "~/assets/wacca/waccaUserPlates.js";
import waccaNavigators from "~/assets/wacca/waccaNavigators";

const categories = [
  {
    name: "Color Schemes",
    items: waccaSymbolColors,
    id: 10,
  },
  {
    name: "Icons",
    items: waccaIcons,
    id: 6,
  },
  {
    name: "Note Sounds",
    items: waccaSoundEffects,
    id: 11,
  },
  {
    name: "User Plates",
    items: waccaUserPlates,
    id: 16,
  },
  {
    name: "Navigators",
    items: waccaNavigators,
    id: 15,
  },
  {
    name: "Titles",
    items: waccaTitles,
    id: 5,
  },
];

definePageMeta({
  middleware: ["auth"],
});

const activeCategory = ref(0);
const lang = useState("language");

function getTooltip(category, item) {
  const name = (lang.value === "en" && item.nameEnglish) || item.name;
  const acquisition =
    (lang.value === "en" && item.acquisitionEnglish) || item.acquisition || "";

  let out = `<h2>${name}</h2>`;

  if (category.id === 16) {
    out += `<img src="/wacca/img/plates/${item.path}.png" />`;
  }

  out += `<p>${acquisition}</p>`;

  return out;
}
</script>
