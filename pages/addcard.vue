<template>
  <v-container>
    <div class="addcard-form">
      <h1>Add a card</h1>

      <v-text-field
        v-model="luid"
        label="Card ID/Access Code"
        counter="20"
        size="xl"
        maxlength="20"
      ></v-text-field>

      <v-btn block color="primary" @click="addCard">Add Card</v-btn>
    </div>
  </v-container>
</template>

<script setup>
const luid = ref("");

watch(luid, (newLuid) => {
  // only allow numbers
  luid.value = newLuid.replace(/\D/g, "");
});
</script>
