<template>
  <v-container>
    <div v-if="profileLoading" class="loading">
      <v-progress-circular
        indeterminate
        color="primary"
        :size="80"
        :width="10"
      ></v-progress-circular>
    </div>

    <v-alert v-if="profileError" type="error">
      Couldn't reach the API. Please try again later.
    </v-alert>

    <div v-if="!profileLoading && !profileError">
      <slot></slot>
    </div>
  </v-container>
</template>

<script setup>
const profileLoading = useState("profileLoading", () => true);
const profileError = useState("profileError");
</script>
