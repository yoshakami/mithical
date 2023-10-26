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

  for (let i = 0; i < 101; i++) {
    dataset.push(0);
  }

  props.scores.forEach((score) => {
    const index = Math.floor(score * 0.0001);

    dataset[index]++;
  });

  // remove the first x elements
  dataset.splice(0, start);

  return dataset;
});

function bisectRight(arr, value, lo = 0, hi = arr.length) {
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] < value) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  return lo;
}

const percentile = computed(() => {
  let percentile =
    1 - bisectRight(props.scores, props.score) / props.scores.length;

  return Math.round(percentile * 1000) / 10;
});

const labels = [];
for (let i = start; i < 100; i++) {
  labels.push(i + "0k");
}
labels.push("1M");

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
          text: "Score",
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
          max: 1010000,
          display: false,
        },
      },

      plugins: {
        tooltip: {
          callbacks: {
            title: (context) => {
              if (context[0].parsed.x + start === 100)
                return (1000000).toLocaleString();

              const scoreFrom = (
                (context[0].parsed.x + start) *
                10000
              ).toLocaleString();
              const scoreTo = (
                (context[0].parsed.x + start + 1) * 10000 -
                1
              ).toLocaleString();

              return `${scoreFrom} - ${scoreTo}`;
            },
            label: (context) => {
              return `${context.raw} score` + (context.raw === 1 ? "" : "s");
            },
          },
        },
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
                content: `You (Top ${percentile.value}%)`,
                position: "end",
                display: true,
                yAdjust: 20,
                padding: 2,
              },
              scaleID: "scoreAxis",
              value: props.score == 1000000 ? 1005000 : props.score,
            },
          },
        },
      },
    },
  };

  new Chart(histogramChart.value.getContext("2d"), cfg);
});
</script>
