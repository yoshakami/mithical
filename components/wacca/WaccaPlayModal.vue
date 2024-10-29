<template>
  <div class="modal on" @click="close">
    <div class="modal-content" @click.stop>
      <v-card>
        <v-card-title>
          <div class="d-flex justify-space-between align-center">
            Play Details
            <v-btn icon variant="plain" @click="close">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </v-card-title>

        <v-card-text>
          <WaccaPlay :play="props.play" force-expand @click="close" />
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<style scoped lang="scss">
.modal-content {
  flex: 0 1 1000px;
  transform: translateX(-10px);
}
</style>

<script setup>
  import { defineEmits } from 'vue';

  const emit = defineEmits(['closeModal']);

  const props = defineProps({
    play: {
      type: Object,
      required: true,
    },
  });

  const close = () => {
    emit('closeModal');
  };
</script>
