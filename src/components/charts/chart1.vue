<template>
  <v-chart class="chart" :option="option" theme="dark" />
  <dv-decoration-4
    :reverse="true"
    style="margin-top: -12%; margin-bottom: 8%; width: 100%; height: 1rem"
  />
</template>
<script>
export default {
  data() {
    return {
      option: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        toolbox: {
          feature: {
            magicType: {
              title: {
                line: "switch to line chart",
                bar: "switch to bar chart",
              },
              type: ["line", "bar"],
            },
          },
          right: "10%",
          top: "10%",
        },
        legend: {
          show: true,
          top: "10%",
          textStyle: {
            color: "#35ffff",
            fontSize: 15,
          },
        },
        xAxis: {
          type: "category",
          name: "Number of Subscription",
          nameLocation: "middle",
          nameTextStyle: {
            color: "#35ffff",
            fontWeight: "bold",
            fontSize: 15,
          },
          nameGap: 20,
          data: ["0.5k", "1.5k", "5k", "10k", "15k"],
          axisPointer: {
            type: "shadow",
          },
        },
        yAxis: [
          {
            position: "right",
            offset: -10,
          },
          {
            position: "left",
            offset: -10,
            name: "Elapsed Time(ms)",
            nameLocation: "middle",
            nameTextStyle: {
              color: "#35ffff",
              fontWeight: "bold",
              fontSize: 15,
            },
          },
        ],
        series: [
          {
            name: "EP",
            type: "bar",
            data: [156, 327, 872, 1869, 2705],
          },
          {
            name: "GP",
            type: "bar",
            data: [132, 281, 635, 1685, 2256],
          },
        ],
        backgroundColor: "rgba(0,0,0,0)",
      },
    };
  },
};
</script>
<style>
.chart {
  /* transform: scale(0.56, 0.56);
  margin-top: -30%;
  margin-left: -55%;
  width: 200%;
  height: 50%; */
  margin-top: 10%;
  width: 100%;
  height: 25%;
}
</style>
