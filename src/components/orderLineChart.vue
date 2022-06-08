<template>
  <v-chart
    class="order-line-chart"
    ref="orderLineChart"
    :option="option"
    theme="dark"
    manual-update
  />
</template>

<script>
export default {
  props: [
    "time",
    "isFinish",
    "orderData",
    "passengerOrderData",
    "newPassengerOrderData",
    "outdatedPassengerOrderData",
  ],
  data() {
    return {
      option: {
        title: {
          text: "Request Analysis",
          textStyle: {
            color: "#35ffff",
            fontSize: 30,
            fontStyle: "oblique",
            textShadowColor: "#fadb14",
            textShadowBlur: 3,
            textShadowOffsetX: 3,
            textShadowOffsetY: 2,
          },
          left: "center",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        legend: {
          show: true,
          top: "13%",
          textStyle: {
            color: "#35ffff",
            fontSize: 15,
          },
        },
        grid: { top: "30%" },
        xAxis: {
          min: "dataMin",
          name: "Time",
          type: "time",
          nameLocation: "middle",
          nameTextStyle: {
            color: "#35ffff",
            fontWeight: "bold",
            fontSize: 15,
          },
          nameGap: 30,
          splitLine: {
            show: false,
          },
          axisLabel: {
            hideOverlap: true,
            formatter: function (value) {
              return new Date(value * 1000).format("hh:mm:ss");
            },
          },
          axisPointer: {
            label: {
              show: true,
              formatter: function (params) {
                return new Date(params.value * 1000).format("hh:mm:ss");
              },
            },
          },
        },
        yAxis: {
          type: "value",
          min: "dataMin",
          name: "Order number",
          nameLocation: "center",
          nameTextStyle: {
            color: "#35ffff",
            fontWeight: "bold",
            fontSize: 15,
          },
          nameGap: 30,
          splitLine: {
            show: false,
          },
          offset: -20,
          axisPointer: {
            label: {
              show: true,
              formatter: (params) => Number.parseInt(params.value),
            },
          },
        },

        series: [
          {
            name: "Matched Order",
            type: "line",
            data: this.outdatedPassengerOrderData,
          },

          {
            name: "Total Order",
            type: "line",
            data: this.passengerOrderData,
          },
          {
            name: "New Order",
            type: "line",
            data: this.newPassengerOrderData,
          },
          {
            name: "Expired Order",
            type: "line",
            data: this.orderData,
          },
        ],
        backgroundColor: "rgba(0,0,0,0)",
      },
    };
  },
  watch: {
    time: {
      handler: function () {
        this.option.series = [
          {
            name: "Expired Order",
            type: "line",
            data: this.orderData,
          },
          {
            name: "Total Order",
            type: "line",
            data: this.passengerOrderData,
          },
          {
            name: "New Order",
            type: "line",
            data: this.newPassengerOrderData,
          },
          {
            name: "Matched Order",
            type: "line",
            data: this.outdatedPassengerOrderData,
          },
        ];
        if (this.$refs.orderLineChart) {
          setTimeout(() => {
            this.$refs.orderLineChart.setOption(this.option);
          }, 1000);
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style>
.order-line-chart {
  width: 100%;
  height: 55%;
}
</style>
