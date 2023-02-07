<template>
  <v-container>
    <v-alert type="warning">
      This page is just for demonstration purposes for now. It may or may not
      show correct data, and won't save anything yet.
    </v-alert>

    <WaccaProfileRequired>
      <h1>Current profile: {{ profile.user_name }}</h1>

      <div v-for="option in optionList" :key="option.name" class="option">
        <p class="option-heading">{{ option.text }}</p>

        <div v-if="option.type == 'slider'">
          <v-slider
            color="primary"
            v-model="options[option.id]"
            :min="option.min"
            :max="option.max"
            :step="option.step"
            thumb-label
            hide-details
          >
            <template v-slot:thumb-label="{ modelValue }">
              {{ option.format(modelValue) }}
            </template>

            <template v-slot:prepend>
              {{ option.format(options[option.id]) }}
            </template>
          </v-slider>
        </div>

        <div v-if="option.type == 'options'">
          <v-btn-toggle v-model="options[option.id]" shaped mandatory>
            <v-btn
              color="primary"
              v-for="choice in option.choices"
              :key="choice.value"
              :value="choice.value"
            >
              {{ choice.text }}
            </v-btn>
          </v-btn-toggle>
        </div>

        <div v-if="option.type == 'toggle'">
          <v-switch
            v-model="options[option.id]"
            color="primary"
            hide-details
          ></v-switch>
        </div>
      </div>
    </WaccaProfileRequired>
  </v-container>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"],
});

const profile = useState("profile");

const optionList = [
  {
    id: 1,
    text: "Note speed",
    type: "slider",
    default: 5,
    min: 0,
    max: 50,
    step: 1,
    format: (value) => `×${(value / 10 + 1).toFixed(1)}`,
  },

  {
    id: 2,
    text: "Mask intensity",
    type: "options",
    default: 0,
    choices: [
      { text: "No Mask", value: 0 },
      { text: "+1", value: 1 },
      { text: "+2", value: 2 },
      { text: "+3", value: 3 },
      { text: "+4", value: 4 },
    ],
  },

  {
    id: 3,
    text: "Note sound (?)",
    type: "options",
    default: 105001,
    choices: [{ text: "Default", value: 105001 }],
  },

  {
    id: 4,
    text: "Note color (?)",
    type: "options",
    default: 203001,
    choices: [
      { text: "Current My Color", value: 103001 },
      { text: "Lily Color", value: 203001 },
      { text: "tricolor", value: 203004 },
      { text: "Rune Color", value: 303001 },
    ],
  },

  {
    id: 5,
    text: "Music Volume",
    type: "slider",
    default: 10,
    min: 0,
    max: 10,
    step: 1,
    format: (value) => `${value * 10}%`,
  },

  {
    id: 6,
    text: "Sound effect volume",
    type: "slider",
    default: 10,
    min: 0,
    max: 10,
    step: 1,
    format: (value) => `${value * 10}%`,
  },

  {
    id: 7,
    text: "Play movies?",
    type: "options",
    default: 0,
    choices: [
      { text: "Ask every time", value: 0 },
      { text: "Always NO", value: 1 },
      { text: "Always YES", value: 2 },
    ],
  },

  {
    id: 101,
    text: "Mirror Map?",
    type: "toggle",
    default: false,
  },

  {
    id: 102,
    text: "Position of timing judgment",
    type: "options",
    default: 0,
    choices: [
      { text: "Center", value: 0 },
      { text: "Bottom", value: 1 },
      { text: "Top", value: 2 },
      { text: "Off", value: 3 },
    ],
  },
];
const options = ref({});

function makeOptionsTable() {
  for (const option of optionList) {
    let playerOption = null;

    if (profile.value) {
      playerOption = profile.value.options.find(
        (o) => o.option_id == option.id
      );
    }

    if (playerOption) {
      options.value[option.id] = playerOption.value;
    } else {
      options.value[option.id] = option.default;
    }
  }
}

makeOptionsTable();
watch(profile, makeOptionsTable);
</script>
