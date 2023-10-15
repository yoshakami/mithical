<template>
  <div class="player-chart">
    <canvas ref="playerChart"></canvas>
    <div v-if="playerHistory.length == 0" class="player-chart-text">
      <div>No scores yet. Go for it!</div>
    </div>
  </div>
</template>

<script setup>
import { Chart, registerables } from "chart.js";
import "chartjs-adapter-moment";
import zoomPlugin from "chartjs-plugin-zoom";

Chart.register(zoomPlugin);
Chart.register(...registerables);

const props = defineProps({
  playerHistory: Array,
  song: Object,
});

const playerChart = ref(null);

let chart;

const playerHistoryFormatted = computed(() => {
  const datasets = [
    {
      label: "Normal",
      backgroundColor: "#009de6",
      borderColor: "#009de6",
      pointRadius: 10,
      data: [],
    },
    {
      label: "Hard",
      backgroundColor: "#fed131",
      borderColor: "#fed131",
      pointRadius: 10,
      data: [],
    },
    {
      label: "Expert",
      backgroundColor: "#fc06a3",
      borderColor: "#fc06a3",
      pointRadius: 10,
      data: [],
    },
  ];

  if (props.song.sheets.length === 4) {
    datasets.push({
      label: "Inferno",
      backgroundColor: "#4a004f",
      borderColor: "#4a004f",
      pointRadius: 10,
      data: [],
    });
  }

  for (const score of props.playerHistory) {
    datasets[score.music_difficulty - 1].data.push({
      x: new Date(score.user_play_date),
      y: score.score,
    });
  }

  return datasets;
});

onMounted(() => {
  chart = new Chart(playerChart.value.getContext("2d"), {
    type: "line",
    data: {
      datasets: playerHistoryFormatted.value,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,

      scales: {
        x: {
          type: "time",
          time: {
            unit: "day",
          },
        },

        y: {
          offset: true,
          adterDataLimits: (scale) => {
            scale.max = 50000000;
            scale.min = 0;
          },
          max: 1000000,
        },
      },
      plugins: {
        zoom: {
          pan: {
            enabled: true,
            mode: "x",
          },

          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            mode: "x",
          },
        },
      },
    },
  });
});

function updateChart() {
  chart.data.datasets = playerHistoryFormatted.value;
  chart.update();
  chart.resetZoom();
}

defineExpose({
  updateChart,
});
</script>
