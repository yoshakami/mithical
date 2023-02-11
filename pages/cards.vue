<template>
  <v-container>
    <v-card class="card">
      <v-card-title> Add a card </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="luid"
          label="Card ID/Access Code"
          counter="20"
          maxlength="20"
          :error-messages="errorMessage"
          :messages="message"
          @keydown.enter="addCard"
        ></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" @click="addCard" :loading="loading">
          Add Card
        </v-btn>
      </v-card-actions>
    </v-card>
    <div class="cards">
      <Card
        v-for="card in cards"
        :key="card.luid"
        :card="card"
        @delete="deleteCard(card)"
      />
    </div>
  </v-container>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig();

const luid = ref("");
const cards = useState("cards");
const activeCard = useState("activeCard");
const errorMessage = ref("");
const message = ref("");
const loading = ref(false);

watch(luid, (newLuid) => {
  // only allow numbers
  luid.value = newLuid.replace(/\D/g, "");
  errorMessage.value = "";
  message.value = "";
});

function addCard() {
  // check that the card is valid by asking the API

  if (luid.value.length < 20) {
    errorMessage.value = "Card ID must be 20 characters long.";
    return;
  }

  if (cards.value.find((card) => card.luid === luid.value)) {
    errorMessage.value = "You already added this card.";
    return;
  }

  loading.value = true;
  $fetch(`${runtimeConfig.API_URL}/card/${luid.value}`)
    .then((data) => {
      loading.value = false;
      errorMessage.value = "";

      cards.value.push({
        luid: luid.value,
        user_name: data.user_name,
        id: data.id,
      });

      localStorage.setItem("cards", JSON.stringify(cards.value));
      activeCard.value = luid.value;
      localStorage.setItem("activeCard", activeCard.value);

      message.value = "Card added successfully!";
      luid.value = "";
    })
    .catch((err, data) => {
      errorMessage.value =
        err.data?.errors[0].msg ||
        "Couldn't reach the API. Please try again later.";
      loading.value = false;
    });
}

function deleteCard(card) {
  cards.value = cards.value.filter((c) => c.luid !== card.luid);
  localStorage.setItem("cards", JSON.stringify(cards.value));

  if (activeCard.value === card.luid) {
    if (cards.value.length > 0) {
      activeCard.value = cards.value[0].luid;
      localStorage.setItem("activeCard", activeCard.value);
    } else {
      activeCard.value = null;
      localStorage.removeItem("activeCard");
    }
  }
}
</script>
