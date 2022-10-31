<template>
  <div>
    <div v-if="profileLoading" class="loading">
      <v-progress-circular
        indeterminate
        color="primary"
        :size="80"
        :width="10"
      ></v-progress-circular>
    </div>

    <div v-if="profileError" class="loading">
      Something went wrong with the API :( Please try again later.
    </div>

    <div v-if="!profileLoading && !profileError">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const profileLoading = useState("profileLoading", () => true);
const profileError = useState("profileError");
</script>
