<template>
  <v-chart class="chart" :option="option" theme="dark" />
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
          name: "Detour Ratio",
          nameLocation: "middle",
          nameTextStyle: {
            color: "#35ffff",
            fontWeight: "bold",
            fontSize: 15,
          },
          nameGap: 20,
          data: [0.1, 0.3, 0.5, 0.7, 0.9],
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
            data: [485, 591, 769, 1369, 1806],
          },
          {
            name: "GP",
            type: "bar",
            data: [402, 495, 590, 1126, 1426],
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
  margin-top: -10%;
  width: 100%;
  height: 25%;
}
</style>
