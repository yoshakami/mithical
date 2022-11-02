<template>
  <v-container>
    <div class="cards">
      <ul>
        <li v-for="card in cards">{{ card.luid }} {{ card.user_name }}</li>
      </ul>
    </div>

    <div class="addcard-form">
      <h1>Add a card</h1>

      <v-text-field
        v-model="luid"
        label="Card ID/Access Code"
        counter="20"
        maxlength="20"
        :error-messages="errorMessage"
        :messages="message"
        class="mb-1"
      ></v-text-field>

      <v-btn block color="primary" @click="addCard" :loading="loading"
        >Add Card</v-btn
      >
    </div>
  </v-container>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig();

const luid = ref("");
const cards = useState("cards");
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
    errorMessage.value = "Look up, you already added this card.";
    return;
  }

  loading.value = true;
  $fetch(`${runtimeConfig.apiUrl}/card/${luid.value}`)
    .then((data) => {
      loading.value = false;
      errorMessage.value = "";

      message.value = "Card added successfully!";

      cards.value.push({
        luid: luid.value,
        user_name: data.user_name,
      });

      localStorage.setItem("cards", JSON.stringify(cards.value));
    })
    .catch((err, data) => {
      errorMessage.value = err.data.errors[0].msg;
      loading.value = false;
    });
}
</script>
