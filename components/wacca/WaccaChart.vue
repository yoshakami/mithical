<template>
  <div class="player-chart">
    <canvas ref="playerChart"></canvas>
    <div v-if="props.loading" class="player-chart-text">
      <div>Loading...</div>
    </div>
    <div
      v-if="!props.loading && playerHistory.length == 0"
      class="player-chart-text"
    >
      <div>No plays yet. Go for it!</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.player-chart {
  height: 300px;
  position: relative;

  .player-chart-text {
    position: absolute;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    background: rgba(var(--v-theme-surface), 0.5);
    div {
      font-size: 1.3rem;
      font-weight: bold;
    }
  }
}
</style>

<script setup>
import { Chart } from "chart.js";

const props = defineProps({
  playerHistory: Array,
  song: Object,
  loading: Boolean,
  difficultyFilter: Number,
});

const version = useState("version");

const filteredsheets = computed(() => {
  return props.song.sheets.filter(
    (sheet) => sheet.gameVersion <= version.value
  );
});

const playerChart = ref(null);

let chart;

const pointRadius = 4;
const playerHistoryFormatted = computed(() => {
  const datasets = [
    {
      label: "Normal",
      backgroundColor: "#009de6",
      borderColor: "#009de6",
      pointRadius: pointRadius,
      data: [],
    },
    {
      label: "Hard",
      backgroundColor: "#fed131",
      borderColor: "#fed131",
      pointRadius: pointRadius,
      data: [],
    },
    {
      label: "Expert",
      backgroundColor: "#fc06a3",
      borderColor: "#fc06a3",
      pointRadius: pointRadius,
      data: [],
    },
  ];

  if (filteredsheets.value.length === 4) {
    datasets.push({
      label: "Inferno",
      backgroundColor: "#4a004f",
      borderColor: "#83008c",
      pointRadius: pointRadius,
      data: [],
    });
  }

  for (let i = props.playerHistory.length - 1; i >= 0; i--) {
    const score = props.playerHistory[i];

    if (
      !score.info.clear_status.is_give_up &&
      datasets[score.info.music_difficulty - 1]
    ) {
      if (score.info.user_play_date == "1970-01-01T00:00:00+00:00") {
        datasets[score.info.music_difficulty - 1].data.unshift({
          x: new Date("2022-09-01T00:00:00+09:00"),
          y: score.info.score,
        });
      } else {
        datasets[score.info.music_difficulty - 1].data.push({
          x: new Date(score.info.user_play_date),
          y: score.info.score,
        });
      }
    }
  }

  if (props.difficultyFilter) {
    return [datasets[props.difficultyFilter - 1]];
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
        legend: {
          display: false,
        },
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
  if (!chart) return;
  chart.data.datasets = playerHistoryFormatted.value;
  chart.update();
  chart.resetZoom();
}

function difficultyFilter(difficulty) {
  if (!chart) return;

  for (let i = props.playerHistory.length - 1; i >= 0; i--) {
    // Hide all datasets except the one we filtered to
    // Show all if filter is set to null, thus disabling
    chart.setDatasetVisibility(i, !difficulty || i == difficulty - 1);
  }

  chart.update();
}

defineExpose({
  updateChart,
  difficultyFilter,
});
</script>
