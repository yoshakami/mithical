<template>
  <div class="histogram">
    <canvas ref="histogramChart"></canvas>
  </div>
</template>

<script setup>
import { Chart } from "chart.js";

const props = defineProps({
  score: Number,
  scores: Array,
  color: String,
  label: String,
});

const histogramChart = ref(null);
const start = 70;

const histogramData = computed(() => {
  const dataset = [];

  for (let i = 0; i < 100; i++) {
    dataset.push(0);
  }

  props.scores.forEach((score) => {
    const index = Math.ceil(score * 0.0001);

    dataset[index]++;
  });

  // remove the first 70 elements
  dataset.splice(0, start);

  return dataset;
});

const labels = [];
for (let i = start; i < 100; i++) {
  labels.push(i + "%");
}

onMounted(() => {
  const cfg = {
    data: {
      labels: labels,
      datasets: [
        {
          type: "bar",
          label: props.label,
          data: histogramData.value,
          backgroundColor: props.color,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,

      scales: {
        x: {
          position: "bottom",
          id: "percentageAxis",
          grid: {
            display: false,
          },
          ticks: {
            padding: 10,
          },
        },
        scoreAxis: {
          position: "bottom",
          id: "scoreAxis",
          type: "linear",
          min: start * 10000,
          max: 1000000,
          display: false,
        },
      },

      plugins: {
        annotation: {
          clip: false,
          annotations: {
            playerLine: {
              type: "line",
              borderColor: "#e60065",
              borderWidth: 2,
              label: {
                backgroundColor: "rgba(229,0,101, 1)",
                borderRadius: 0,
                content: "You",
                position: "end",
                display: true,
                yAdjust: 20,
                padding: 2,
              },
              scaleID: "scoreAxis",
              value: props.score,
            },
          },
        },
      },
    },
  };

  new Chart(histogramChart.value.getContext("2d"), cfg);
});
</script>
