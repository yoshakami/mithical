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
        size="xl"
        maxlength="20"
        :error-messages="errorMessage"
        :messages="messages"
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
const errorMessage = ref(false);
const messages = ref(false);
const loading = ref(false);

watch(luid, (newLuid) => {
  // only allow numbers
  luid.value = newLuid.replace(/\D/g, "");
  errorMessage.value = false;
  messages.value = false;
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
    .catch((err) => {
      errorMessage.value = "Something went wrong, try again later!";
      loading.value = false;
    })
    .then((data) => {
      loading.value = false;

      if (data.error) {
        errorMessage.value = data.reason;
      } else {
        errorMessage.value = false;

        messages.value = "Card added successfully!";

        cards.value.push({
          luid: luid.value,
          user_name: data.data.user_name,
        });

        localStorage.setItem("cards", JSON.stringify(cards.value));
      }
    });
}
</script>
