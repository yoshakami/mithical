<template>
  <v-container>
    <h1>Current profile: {{ profile.name }}</h1>

    <div v-for="option in options" :key="option.name" class="option">
      <p class="option-heading">{{ option.text }}</p>

      <div v-if="option.type == 'slider'">
        <v-slider
          color="primary"
          v-model="profile.wacca.options[option.name]"
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
            {{ option.format(profile.wacca.options[option.name]) }}
          </template>
        </v-slider>
      </div>

      <div v-if="option.type == 'options'">
        <v-btn-toggle
          v-model="profile.wacca.options[option.name]"
          shaped
          mandatory
        >
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
          v-model="profile.wacca.options[option.name]"
          color="primary"
          hide-details
        ></v-switch>
      </div>
    </div>
  </v-container>
</template>

<script setup>
const profile = useState("profile");

const options = [
  {
    name: "NoteSpeed",
    text: "Note speed",
    type: "slider",
    default: 5,
    min: 0,
    max: 50,
    step: 1,
    format: (value) => `×${(value / 10 + 1).toFixed(1)}`,
  },

  {
    name: "Mask",
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
    name: "InputSoundEffects",
    text: "Note sound (?)",
    type: "options",
    default: 105001,
    choices: [{ text: "Default", value: 105001 }],
  },

  {
    name: "MyColor",
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
    name: "BgmVolume",
    text: "Music Volume",
    type: "slider",
    default: 10,
    min: 0,
    max: 10,
    step: 1,
    format: (value) => `${value * 10}%`,
  },

  {
    name: "SoundEffectVolume",
    text: "Sound effect volume",
    type: "slider",
    default: 10,
    min: 0,
    max: 10,
    step: 1,
    format: (value) => `${value * 10}%`,
  },

  {
    name: "Movie",
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
    name: "Mirror",
    text: "Mirror Map?",
    type: "toggle",
    default: false,
  },

  {
    name: "JudgePosition",
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

const selectedOptions = ref({});

// fill selectedOptions with defaults
function putDefaults() {
  for (const option of options) {
    profile.value.wacca.options[option.name] =
      profile.value.wacca.options[option.name] ?? option.default;
  }
}

putDefaults();
watch(profile, putDefaults);
</script>
