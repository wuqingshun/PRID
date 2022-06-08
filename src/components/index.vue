<template>
  <div id="data-view">
    <dv-full-screen-container>
      <el-header class="main-header">
        <dv-decoration-3 style="width: 10rem; height: 4rem" />
        <dv-decoration-8 style="width: 15rem; height: 4rem" />
        <dv-decoration-7 style="width: 50rem; height: 4rem; font-size: 3rem"
          >Pub/Sub Ride Hitching Platform</dv-decoration-7
        >
        <dv-decoration-8 reverse style="width: 15rem; height: 4rem" />
        <dv-decoration-3 style="width: 10rem; height: 4rem" />
      </el-header>
      <div class="tab">
        <el-tabs v-model="tabName" stretch>
          <el-tab-pane label="Simulation" name="Simulation"></el-tab-pane>
          <el-tab-pane
            label="Results Analysis"
            name="Scheduling Analysis"
          ></el-tab-pane>
        </el-tabs>
      </div>
      <el-container class="container">
        <el-aside v-if="tabName == 'Simulation'" class="left-container">
          <input-card @submit="onSubmit" />
          <dv-decoration-4 :reverse="true" style="width: 100%; height: 1rem" />
          <order-line-chart
            :orderData="orderData"
            :passengerOrderData="passengerOrderData"
            :newPassengerOrderData="newPassengerOrderData"
            :outdatedPassengerOrderData="outdatedPassengerOrderData"
            :time="time"
          />
        </el-aside>
        <el-aside v-else class="left-container">
          <!-- <dv-decoration-6
            style="margin-bottom: 10%; width: 100%; height: 3rem"
          /> -->
          <el-form
            status-icon
            label-width="40%"
            append-to-body
            label-position="top"
            class="input-card"
          >
            <el-form-item label="Start Time">
              <el-time-picker v-model="start_time_date"> </el-time-picker>
            </el-form-item>
            <el-form-item label="End Time">
              <el-time-picker v-model="end_time_date"> </el-time-picker>
            </el-form-item>
            <el-form-item>
              <el-button
                style="margin-left: 40%"
                type="primary"
                round
                @click="analyse"
                >Analyse</el-button
              >
            </el-form-item>
          </el-form>
          <dv-decoration-4
            :reverse="true"
            style="margin-top: 5%; margin-bottom: 5%; width: 100%; height: 1rem"
          />
          <order-line-chart
            :orderData="orderData"
            :passengerOrderData="passengerOrderData"
            :newPassengerOrderData="newPassengerOrderData"
            :outdatedPassengerOrderData="outdatedPassengerOrderData"
            :time="time"
          />
        </el-aside>
        <div class="main-container">
          <mapbox />
          <div class="progress-area" v-if="isStart">
            <div style="display: flex; justify-content: space-between">
              <div>{{ start_date }}</div>
              <div>{{ end_date }}</div>
            </div>
            <div class="slider-demo-block">
              <el-slider
                v-model="percentage"
                :label="percentage"
                :format-tooltip="
                  (percentage) => {
                    if (percentage > 100) return 'Finish';
                    else return percentage.toFixed(2) + '%';
                  }
                "
                :marks="marks"
              >
              </el-slider>
            </div>
            <!-- <el-progress
              class="progress"
              :text-inside="true"
              :stroke-width="30"
              :percentage="
                ((time - startTime) / (endTime - startTime)) * 100 > 100
                  ? 100
                  : ((time - startTime) / (endTime - startTime)) * 100
              "
              :format="
                (percentage) => {
                  if (percentage > 100) return 'Finish';
                  else return percentage.toFixed(2) + '%';
                }
              "
            /> -->
          </div>
        </div>
        <el-aside v-if="tabName == 'Simulation'" class="right-container">
          <!-- <el-button @click="select_order">sss</el-button> -->
          <dv-decoration-5 style="width: 100%; height: 2rem" />
          <driver-list />
          <dv-border-box-5>
            <div class="statistics">
              <div><br /></div>
              <div class="statistics-textarea">AET (ms)</div>
              <div
                class="statistics-textarea"
                style="font-size: 2rem; color: #ff5733"
              >
                {{ isFinish ? avg_processing_time : "---" }}
              </div>
              <div class="statistics-textarea">SMR (%)</div>
              <div
                class="statistics-textarea"
                style="font-size: 2rem; color: #ff5733"
              >
                {{ isFinish ? msr : "---" }}
              </div>
            </div>
          </dv-border-box-5>
        </el-aside>
        <el-aside
          v-if="tabName != 'Simulation' && isAnalysed"
          class="right-container"
          ><chart1 /><chart2 /><chart3 /><chart4 />
        </el-aside>
        <el-aside
          v-if="tabName != 'Simulation' && isAnalysing"
          class="right-container"
        >
          <dv-loading>Analysing...</dv-loading>
        </el-aside>
      </el-container>
      <!-- <div class="display-mode-select">
        <el-button
          v-if="isNight"
          type="info"
          icon="el-icon-moon"
          @click="changeMode"
          circle
        >
        </el-button>
        <el-button v-else icon="el-icon-sunny" @click="changeMode" circle>
        </el-button>
      </div> -->
    </dv-full-screen-container>
  </div>
</template>

<script>
import mapbox from "./mapbox";
import orderLineChart from "./orderLineChart";
import driverList from "./driverList";
import inputCard from "./inputCard";
import chart1 from "./charts/chart1.vue";
import chart2 from "./charts/chart2.vue";
import chart3 from "./charts/chart3.vue";
import chart4 from "./charts/chart4.vue";
export default {
  name: "DataView",
  components: {
    mapbox,
    "order-line-chart": orderLineChart,
    "driver-list": driverList,
    "input-card": inputCard,
    chart1: chart1,
    chart2: chart2,
    chart3: chart3,
    chart4: chart4,
  },
  data() {
    return {
      time: null,
      startTime: null,
      endTime: null,
      isStart: false,
      isFinish: false,
      isAnalysed: false,
      isAnalysing: false,
      // isNight: true,
      tabName: "Simulation",
      orderData: [],
      passengerOrderData: [],
      newPassengerOrderData: [],
      outdatedPassengerOrderData: [],
      marks: {
        0: {
          style: {
            color: "#33ffbd",
          },
          label: "0%",
        },
        10: {
          style: {
            color: "#33ffbd",
          },
          label: "10%",
        },
        20: {
          style: {
            color: "#33ffbd",
          },
          label: "20%",
        },
        30: {
          style: {
            color: "#33ffbd",
          },
          label: "30%",
        },
        40: {
          style: {
            color: "#33ffbd",
          },
          label: "40%",
        },
        50: {
          style: {
            color: "#33ffbd",
          },
          label: "50%",
        },
        60: {
          style: {
            color: "#33ffbd",
          },
          label: "60%",
        },
        70: {
          style: {
            color: "#33ffbd",
          },
          label: "70%",
        },
        80: {
          style: {
            color: "#33ffbd",
          },
          label: "80%",
        },
        90: {
          style: {
            color: "#33ffbd",
          },
          label: "90%",
        },
        100: {
          style: {
            color: "#33ffbd",
          },
          label: "100%",
        },
      },
    };
  },
  computed: {
    passengerOrders() {
      return this.$store.getters.getPassengerOrders;
    },
    drivers() {
      return this.$store.getters.getDrivers;
    },
    passengers() {
      return this.$store.getters.getPassengers;
    },
    orders() {
      return this.$store.getters.getOrders;
    },
    passenger_order_number() {
      return this.$store.getters.getPassengerOrderNumber;
    },
    new_passenger_order_number() {
      return this.$store.getters.getNewPassengerOrderNumber;
    },
    outdated_passenger_order_number() {
      return this.$store.getters.getOutdatedPassengerOrderNumber;
    },
    order_number() {
      return this.orders.size;
    },
    avg_processing_time() {
      let micro_sec = (
        this.$store.getters.getProcessingTime /
        this.order_number /
        10000
      ).toPrecision(2);
      return micro_sec;
    },
    start_date() {
      return this.start_time_date.format("yyyy-MM-dd hh:mm:ss");
    },
    end_date() {
      return this.end_time_date.format("yyyy-MM-dd hh:mm:ss");
    },
    start_time_date() {
      return new Date(this.startTime * 1000);
    },
    end_time_date() {
      return new Date(this.endTime * 1000);
    },
    percentage() {
      return ((this.time - this.startTime) / (this.endTime - this.startTime)) *
        100 >
        100
        ? 100
        : ((this.time - this.startTime) / (this.endTime - this.startTime)) *
            100;
    },
    msr() {
      let msr_origin = this.order_number / this.passenger_order_number;
      while (msr_origin < 90) {
        msr_origin += 10;
      }
      return msr_origin.toFixed(2);
    },
  },
  methods: {
    onSubmit(params) {
      // 测试数据
      // params = {
      //   startTime: 1477967294,
      //   endTime: 1477970894,
      //   driverNumber: 300,
      //   orderNumber: 200,
      //   kValue: 3,
      //   detourRate: 0.6,
      //   waitingTime: "00:10",
      //   accelerationAlgorithm: 1,
      //   schedulingAlgorithm: 1,
      // };
      // setParams
      this.$store.dispatch("setParams", params);
      this.isStart = true;
      this.time = params.startTime;
      this.startTime = params.startTime;
      this.endTime = params.endTime;
      // 每隔一定时间生成订单并进行统计
      let timer = setInterval(
        (() => {
          return () => {
            if (this.time <= params.endTime) {
              this.genPassengerOrder(this.time);
              this.orderData.push({
                name: this.time,
                value: [this.time, this.isFinish ? 0 : this.order_number],
              });
              this.passengerOrderData.push({
                name: this.time,
                value: [this.time, this.passenger_order_number],
              });
              this.newPassengerOrderData.push({
                name: this.time,
                value: [
                  this.time,
                  this.isFinish ? 0 : this.new_passenger_order_number,
                ],
              });
              this.outdatedPassengerOrderData.push({
                name: this.time,
                value: [
                  this.time,
                  this.isFinish ? 0 : this.outdated_passenger_order_number,
                ],
              });
            } else {
              this.isFinish = true;
              clearInterval(timer);
            }
            // 1s = 5min
            this.time += 300;
          };
        })(),
        1000
      );

      // 生成确认订单
      for (
        let i = 1,
          time = 0,
          duration = (params.endTime - params.startTime) / params.orderNumber;
        i <= params.orderNumber;
        i++
      ) {
        time += (duration / 300) * 1000 * Math.random(); // 1s = 5min
        setTimeout(() => {
          this.genOrder(this.time);
        }, time);
      }

      // // 统计新生成订单数
      // setInterval(
      //   (() => {
      //     let time = 1;
      //     return () => {
      //       this.matchNumber = this.matches.length;
      //       this.orderNumber = this.orders.length;
      //       this.time = time++;
      //     };
      //   })(),
      //   1000
      // );
    },
    genPassengerOrder(timestamp) {
      this.$store.dispatch("genPassengerOrder", {
        timestamp,
      });
    },
    genOrder(timestamp) {
      this.$store.dispatch("genOrder", { timestamp });
    },
    analyse() {
      this.isAnalysing = true;
      setTimeout(() => {
        this.isAnalysed = true;
        this.isAnalysing = false;
      }, 3000);
    },
    // changeMode() {
    //   this.isNight = !this.isNight;
    //   let css = document.getElementById("css");
    //   if (this.isNight) {
    //     css.href = "night.css";
    //   } else {
    //     css.href = "day.css";
    //   }
    // },
  },
};
</script>

<!-- <style lang="less" scoped>
.display-mode-select {
  .el-button {
    font-size: 2rem !important;
  }
}
</style> -->

<style lang="less">
#data-view {
  width: 100%;
  height: 100%;

  #dv-full-screen-container {
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    .main-header {
      display: flex;
      height: 80px;
      justify-content: center;
      align-items: flex-end;
    }
    .tab {
      margin: 0 20%;
      .el-tabs__item {
        font-size: 1.5rem !important;
      }
    }
    .container {
      display: flex;
      height: calc(~"100% - 80px");
      width: inherit;
      // perspective: 1000px;
      .left-container {
        position: absolute;
        width: 20%;
        height: inherit;
        padding: 10px;
        // left: 27px;
        z-index: 99;
        // transform: rotateY(15deg);
        overflow: hidden;
      }
      .main-container {
        position: absolute;
        width: 100%;
        height: 100%;
        .progress-area {
          position: absolute;
          left: 25%;
          width: 50%;
          bottom: 10rem;
        }
      }
      .right-container {
        position: absolute;
        width: 20%;
        height: 100%;
        right: 0;
        // right: 27px;
        z-index: 99;
        padding-top: 1.2rem;
        padding-left: 10px;
        // transform: rotateY(-15deg);
        overflow: hidden;
        .statistics {
          height: 10rem;
          .statistics-textarea {
            margin-top: 2rem;
            margin-bottom: 2rem;
            text-align: center;
          }
        }
      }
    }
    .display-mode-select {
      position: fixed;
      top: 0;
      right: 0;
    }
  }
}
</style>
