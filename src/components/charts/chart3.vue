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
          name: "Waiting Time(min)",
          nameLocation: "middle",
          nameTextStyle: {
            color: "#35ffff",
            fontWeight: "bold",
            fontSize: 15,
          },
          nameGap: 20,
          data: [2, 5, 8, 10, 15],
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
            data: [85, 402, 524, 685, 1502],
          },
          {
            name: "GP",
            type: "bar",
            data: [56, 326, 469, 524, 1256],
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
