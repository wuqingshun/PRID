<template>
  <div class="driver-list-container">
    <div class="select-container">
      <span style="margin-right: 1rem">Driver Tracking</span>
      <el-select
        id="driver-select"
        v-model="driverlist"
        multiple
        collapse-tags
        size="mini"
        placeholder="Select drivers"
      >
        <el-option
          v-for="driver_id of drivers.keys()"
          :key="driver_id"
          :label="driver_id"
          :value="driver_id"
        >
        </el-option>
      </el-select>
    </div>
    <el-scrollbar wrap-style="white-space:nowrap;" max-height="100%">
      <div class="driver-card" v-for="driver_id of driverlist" :key="driver_id">
        <div class="driver-info">
          <el-popover trigger="hover" placement="left">
            <template #reference>
              <el-avatar :src="drivers.get(driver_id).avatar"></el-avatar>
            </template>
            <div>
              <span style="color: #fddd60">Driver Id: </span>{{ driver_id }}
            </div>
            <div>
              <span style="color: #fddd60">Name: </span
              >{{ drivers.get(driver_id).name }}
            </div>
            <div>
              <span style="color: #fddd60">Origin Pos:</span>
              {{
                drivers.get(driver_id).origin_pos[0].toFixed(4) +
                ", " +
                drivers.get(driver_id).origin_pos[1].toFixed(4)
              }}
            </div>
            <div>
              <span style="color: #fddd60"> Dest Pos: </span>
              {{
                drivers.get(driver_id).dist_pos[0].toFixed(4) +
                ", " +
                drivers.get(driver_id).dist_pos[1].toFixed(4)
              }}
            </div>
          </el-popover>
        </div>
        <el-scrollbar class="passenger-info">
          <div>
            <el-popover
              trigger="hover"
              placement="left"
              v-for="passenger_id of drivers.get(driver_id).passengers.keys()"
              :key="passenger_id"
            >
              <template #reference>
                <el-avatar
                  :src="
                    drivers.get(driver_id).passengers.get(passenger_id).avatar
                  "
                ></el-avatar>
              </template>
              <div>
                <span style="color: #fddd60">Order Id: </span>{{ passenger_id }}
              </div>
              <div>
                <span style="color: #fddd60"> Name: </span>
                {{ drivers.get(driver_id).passengers.get(passenger_id).name }}
              </div>
              <div>
                <span style="color: #fddd60"> Start Time: </span>
                {{
                  new Date(
                    drivers.get(driver_id).passengers.get(passenger_id)
                      .start_timestamp * 1000
                  ).format("yyyy-MM-dd hh:mm:ss")
                }}
              </div>
              <div>
                <span style="color: #fddd60"> End Time: </span>
                {{
                  new Date(
                    drivers.get(driver_id).passengers.get(passenger_id)
                      .end_timestamp * 1000
                  ).format("yyyy-MM-dd hh:mm:ss")
                }}
              </div>
              <div>
                <span style="color: #fddd60"> Pick Up Pos: </span>
                {{
                  drivers
                    .get(driver_id)
                    .passengers.get(passenger_id)
                    .pick_up_pos[0].toFixed(4) +
                  ", " +
                  drivers
                    .get(driver_id)
                    .passengers.get(passenger_id)
                    .pick_up_pos[1].toFixed(4)
                }}
              </div>
              <div>
                <span style="color: #fddd60"> Pick Off Pos: </span>
                {{
                  drivers
                    .get(driver_id)
                    .passengers.get(passenger_id)
                    .pick_off_pos[0].toFixed(4) +
                  ", " +
                  drivers
                    .get(driver_id)
                    .passengers.get(passenger_id)
                    .pick_off_pos[1].toFixed(4)
                }}
              </div>
              <div>
                <span style="color: #fddd60"> Score: </span>
                {{ drivers.get(driver_id).passengers.get(passenger_id).score }}
              </div>
            </el-popover>
          </div>
        </el-scrollbar>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      driverlist: [],
    };
  },
  computed: {
    drivers() {
      return this.$store.getters.getDrivers;
    },
    current_timestamp() {
      return this.$store.getters.getCurrentTimestamp;
    },
  },
  watch: {
    drivers: {
      handler: function (newVal) {
        let driverlist = [];
        this.driverlist.forEach((driver_id) => {
          if (newVal.has(driver_id)) driverlist.push(driver_id);
        });
        this.driverlist = driverlist;
      },
      deep: true,
      immediate: true,
    },
    driverlist: {
      handler: function (newVal) {
        this.$store.dispatch("setDriverList", newVal);
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style lang="less">
.driver-list-container {
  display: flex;
  margin-top: -8%;
  flex-direction: column;
  height: 50%;
  .select-container {
    display: flex;
    margin-top: 2rem;
    margin-left: 1rem;
    width: 200%;
    #driver-select {
      display: flex;
      width: 70%;
    }
  }
  .el-scrollbar {
    width: 120%;
  }
  .driver-card {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0 10px;
    width: inherit;
    height: inherit;
    padding: 2rem;
    .driver-info {
      flex-grow: 1;
      margin-right: 2rem;
    }
    .passenger-info {
      flex-grow: 1;
    }
  }
}
</style>
