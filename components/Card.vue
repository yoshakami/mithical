<template>
  <v-card class="card">
    <v-card-text>
      <div class="card-name">
        <div>{{ props.card.user_name }}</div>
        <div>
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                icon
                variant="text"
                size="small"
                @click="deleteCard"
                v-bind="props"
              >
                <v-icon color="error">mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>Remove card</span>
          </v-tooltip>
        </div>
      </div>
      <div class="card-luid">
        <v-tooltip location="top">
          <template v-slot:activator="{ props }">
            <v-btn
              icon
              variant="text"
              size="small"
              @click="toggleHidden"
              v-bind="props"
            >
              <v-icon size="small">{{
                hidden ? "mdi-eye" : "mdi-eye-off"
              }}</v-icon>
            </v-btn>
          </template>
          <span>View full ID</span>
        </v-tooltip>
        {{ formattedLuid }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
const hidden = ref(true);

const props = defineProps({
  card: {
    type: Object,
    required: true,
  },
});

const formattedLuid = computed(() => {
  // replace all numbers with asterisks except the last 4 if hidden
  let luid = props.card.luid;
  if (hidden.value) {
    luid = luid.replace(/\d(?=\d{4})/g, "x");
  }

  // add spaces
  luid = luid.replace(/(.{4})/g, "$1 ").trim();

  return luid;
});

function toggleHidden() {
  hidden.value = !hidden.value;
}

const emit = defineEmits(["delete"]);

function deleteCard() {
  emit("delete");
}
</script>
