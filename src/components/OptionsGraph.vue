<template>
    <div class="flex-1">
        <p>
          Max Profit: {{ maxProfit }} | Max Loss: {{ maxLoss }} | Break Even
          Points:
          {{ breakEvenPoints.join(", ") ?? "None" }}
        </p>
        <div class="bg-white shadow-md border border-solid p-4 h-[591px] mt-4 rounded-md">
          <line-chart :data="chartData" :options="chartOptions" />
        </div>
      </div>
</template>
<script>
import { Line } from "vue-chartjs";

export default {
  name: "OptionsGraph",
  props: {
    chartData: {
      type: Object,
      required: true,
    },
    chartOptions: {
      type: Object,
      required: true,
    },
    maxProfit: {
      type: [ String, Number ],
      required: true,
    },
    maxLoss: {
      type: [ String, Number ],
      required: true,
    },
    breakEvenPoints: {
      type: Array,
      required: true,
    },
  },
  components: {
    LineChart: Line,
  },
};
</script>