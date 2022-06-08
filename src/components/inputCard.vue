<template>
  <el-form
    status-icon
    label-width="40%"
    append-to-body
    label-position="top"
    class="input-card"
  >
    <el-scrollbar height="300px">
      <el-form-item label="Start Time">
        <el-time-picker v-model="startTime"> </el-time-picker>
      </el-form-item>
      <el-form-item label="End Time">
        <el-time-picker v-model="endTime"> </el-time-picker>
      </el-form-item>
      <el-form-item label="Driver Number">
        <el-input v-model="driverNumber" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="Batch Number">
        <el-input v-model="orderNumber" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="K">
        <el-select v-model="kValue" placeholder=" ">
          <el-option v-for="item of 6" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Waiting Time">
        <el-time-select
          v-model="waitingTime"
          start="00:00"
          step="00:05"
          end="02:00"
          placeholder=" "
        >
        </el-time-select
      ></el-form-item>
      <el-form-item label="Detour Rate"
        ><el-input v-model="detourRate" autocomplete="off"></el-input
      ></el-form-item>
      <el-form-item label="Acceleration Algorithm">
        <el-select v-model="accelerationAlgorithm" placeholder=" ">
          <el-option
            v-for="item in accelerationAlgorithmList"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option> </el-select
      ></el-form-item>
      <el-form-item label="Scheduling Algorithm">
        <el-select v-model="schedulingAlgorithm" placeholder=" ">
          <el-option
            v-for="item in schedulingAlgorithmList"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option> </el-select
      ></el-form-item>
      <el-form-item>
        <el-button style="margin-left: 40%" type="primary" round @click="submit"
          >Run</el-button
        >
      </el-form-item>
    </el-scrollbar>
  </el-form>
</template>

<script>
export default {
  emits: ["submit"],
  data() {
    return {
      startTime: null,
      endTime: null,
      driverNumber: null,
      orderNumber: null,
      kValue: null,
      waitingTime: null,
      detourRate: null,
      accelerationAlgorithmList: ["IM", "IPA", "OPA", "GM", "HPA"],
      accelerationAlgorithm: null,
      schedulingAlgorithmList: ["EP", "GP"],
      schedulingAlgorithm: null,
    };
  },
  methods: {
    submit() {
      this.$emit("submit", {
        startTime:
          this.startTime.getHours() * 3600 +
          this.startTime.getMinutes() * 60 +
          this.startTime.getSeconds() +
          1477929600,
        endTime:
          this.endTime.getHours() * 3600 +
          this.endTime.getMinutes() * 60 +
          this.endTime.getSeconds() +
          1477929600,
        driverNumber: parseInt(this.driverNumber),
        orderNumber: parseInt(this.orderNumber) / 10,
        kValue: this.kValue,
        waitingTime: this.waitingTime,
        detourRate: parseFloat(this.detourRate),
        accelerationAlgorithm: this.accelerationAlgorithm,
        schedulingAlgorithm: this.schedulingAlgorithm,
      });
    },
  },
};
</script>

<style lang="less">
.input-card {
  .el-input,
  .el-select {
    width: 100% !important;
  }
}
</style>
