<template>
  <div class="py-10 px-3">
    <h1 class="text-xl font-bold tracking-tight text-gray-900 sm:text-3xl">Options Profit Calculator</h1>

    <div class="flex flex-col md:flex-row gap-2 md:gap-4 mt-7">
      <OptionsGraph :key="graphKey" class="w-full md:w-4/5 mt-[4px]" :maxProfit="maxProfit" :maxLoss="maxLoss" :chartData="chartData" :breakEvenPoints="breakEvenPoints" :chartOptions="chartOptions" />
      <OptionsController class="w-full md:w-1/5 md:min-w-[350px]" :options="options" @update-options="updateOptions" />
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import Chart from "chart.js/auto";

import {
  calculateProfitLoss,
  calculateMaxProfitLossEvenPoints,
  getReasonablePriceRange,
} from "@/utils/optionsCalculations";

import OptionsController from "./OptionsController.vue";
import OptionsGraph from "./OptionsGraph.vue";

export default {
  name: "CodingChallenge",
  props: {
    optionsData: {
      type: Array,
      required: true,
    },
  },
  components: {
    OptionsController,
    OptionsGraph
  },
  data() {
    return {
      graphKey: 0,
      options: this.optionsData.map(
        ({ strike_price, type, bid, ask, long_short, expiration_date }) => ({
          type,
          bid,
          ask,
          strikePrice: strike_price,
          longShort: long_short,
          expirationDate: expiration_date,
        })
      ),
      labels: [],
      data: [],
      profitData: [],
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: "Base Price",
            },
          },
          y: {
            title: {
              display: true,
              text: "Profit/Loss",
            },
          },
        },
        elements: {
          point: {
            pointStyle: false,
          },
          line: {
            borderWidth: 2,
            borderDash: [5, 5],
            borderJoinStyle: "bevel",
          },
        },
      },
      maxProfit: 0,
      maxLoss: 0,
      breakEvenPoints: [],
    };
  },
  mounted() {
    this.calculateRiskReward();
  },
  computed: {
    chartData() {
      return {
        labels: this.labels,
        datasets: [
          ...this.options.map((_, index) => ({
            label: `Option ${index + 1}`,
            data: this.data[index],
          })),
          {
            label: "Profit/Loss",
            data: this.profitData,
            borderDash: [],
          },
        ],
      };
    },
  },
  methods: {
    updateOptions(newOptions) {
      this.graphKey++;
      this.options = newOptions;
      this.calculateRiskReward();
    },
    calculateRiskReward() {
      const priceRange = getReasonablePriceRange(this.options);
      const underlyingPrices = [];
      for (let i = priceRange.min; i < priceRange.max; i++)
        underlyingPrices.push(i);

      const profitLoss = this.options.map((option) =>
        underlyingPrices.map(
          (price) => calculateProfitLoss(option, price).offset
        )
      );

      this.labels = underlyingPrices.map((item) => item.toFixed(2));
      this.data = profitLoss;
      this.profitData = underlyingPrices.map((_, index) =>
        profitLoss.reduce((total, item) => total + item[index], 0)
      );

      const { maxProfit, maxLoss, breakEvenPoints } =
        calculateMaxProfitLossEvenPoints(this.options);

      this.maxProfit = maxProfit;
      this.maxLoss = maxLoss;
      this.breakEvenPoints = breakEvenPoints;
    },
  },
};
</script>

<style scoped></style>
