<template>
  <div>
    <v-container>
      <div class="front-header">
        <MithicalLogo :color="fill" />

        <h1>Mithical</h1>
        <p>cuz every web ui needs a cool name</p>
      </div>

      <v-container style="max-width: 400px">
        <v-btn to="/cards" block color="primary">Manage your cards</v-btn>
      </v-container>
    </v-container>
  </div>
</template>

<script setup>
const theme = useState("theme");

const fill = "#fff"; //computed(() => (theme.value == "Light" ? "#000" : "#fff"));
</script>
