import { createStore } from "vuex";
import { fake } from "faker";
import { selectPassengerOrder } from "../plugins/dbOperator";

class Driver {
  constructor(d_id) {
    this.id = d_id;
    this.name = fake("{{name.firstName}}");
    this.avatar = fake("{{image.avatar}}");
    this.origin_pos = [
      103.97 + 0.15 * Math.random(),
      30.6 + 0.1 * Math.random(),
    ];
    this.dist_pos = [103.97 + 0.15 * Math.random(), 30.6 + 0.1 * Math.random()];
    this.passengers = new Map();
    this.isValid = true;
  }
}
class Passenger {
  constructor(
    id,
    start_timestamp,
    end_timestamp,
    origin_pos,
    dist_pos,
    detourRate
  ) {
    this.id = id;
    this.name = fake("{{name.firstName}}");
    this.avatar = fake("{{image.avatar}}");
    this.start_timestamp = start_timestamp;
    this.end_timestamp = end_timestamp;
    this.detourRate = detourRate;
    this.pick_up_pos = origin_pos;
    this.pick_off_pos = dist_pos;
    this.score = Math.round(70 + Math.random() * 30);
    this.isValid = true;
  }
  set(start_timestamp, end_timestamp, origin_pos, dist_pos, detourRate) {
    this.start_timestamp = start_timestamp;
    this.end_timestamp = end_timestamp;
    this.detourRate = detourRate;
    this.pick_up_pos = origin_pos;
    this.pick_off_pos = dist_pos;
    this.isValid = true;
  }
}

export default createStore({
  state: {
    driverNumber: null,
    orderNumber: null,
    matches: [],
    kValue: null,
    startTime: null,
    endTime: null,
    waitingTime: null,
    detourRate: null,
    accelerationAlgorithm: null,
    schedulingAlgorithm: null,
    drivers: new Map(),
    /* 
    drivers: {id1=>{
      id: int,
      name: string,
      avatar: string,
      origin_pos: array(2),
      dist_pos: array(2),
      passengers: {
        id1=>{
          passenger: Passenger,
          score: int
        },...
      }
    },...}
     */
    driverlist: [],
    /**
     * passengers: {
     *  id=>{
     *    id,
     *    name,
     *    avatar,
     *    origin_pos,
     *    dist_pos,
     *  }
     * }
     */
    passengers: new Map(),
    orders: new Map(),
    passenger_order_number: 0,
    outdated_passenger_order_number: 0,
    new_passenger_order_number: 0,
    processing_time: 0,
  },
  mutations: {
    setParams(state, payload) {
      state.startTime = payload.startTime;
      state.endTime = payload.endTime;
      state.driverNumber = payload.driverNumber;
      state.orderNumber = payload.orderNumber;
      state.kValue = payload.kValue;
      state.waitingTime = payload.waitingTime;
      state.detourRate = payload.detourRate;
      state.accelerationAlgorithm = payload.accelerationAlgorithm;
      state.schedulingAlgorithm = payload.schedulingAlgorithm;
    },
    genPassengerOrder(state, payload) {
      let timeTo = payload.timestamp;
      let timeFrom = payload.timestamp - 1000;
      state.new_passenger_order_number = 0;
      let outdated_passenger_order_number = 0;
      // 先在数据库中找到该时段的所有订单，再随机为订单分配司机
      // 如果此时司机不存在则随机生成司机，如果该司机k值达到上限则换一个司机，如果该司机在订单列表中也换一个
      for (let passenger_order of selectPassengerOrder(timeFrom, timeTo)) {
        state.passenger_order_number++;
        state.new_passenger_order_number++;
        let passenger, d_id, driver;
        // 新订单对象，如果客户对象已存在则覆盖，同时原订单过期
        if (!state.passengers.has(passenger_order.id)) {
          passenger = new Passenger(
            passenger_order.id,
            passenger_order.start_timestamp,
            passenger_order.end_timestamp,
            [passenger_order.origin_lng, passenger_order.origin_lat],
            [passenger_order.dist_lng, passenger_order.dist_lat],
            Math.random() * state.detourRate
          );
          state.passengers.set(passenger_order.id, passenger);
        } else if (!state.passengers.get(passenger_order.id).isValid) {
          // 如果客户已有订单则算过期
          outdated_passenger_order_number++;
          continue;
        } else {
          passenger = state.passengers.get(passenger_order.id);
          passenger.set(
            passenger_order.start_timestamp,
            passenger_order.end_timestamp,
            [passenger_order.origin_lng, passenger_order.origin_lat],
            [passenger_order.dist_lng, passenger_order.dist_lat],
            Math.random() * state.detourRate
          );
          state.passengers.set(passenger_order.id, passenger);
          outdated_passenger_order_number++;
        }

        // 分配司机
        do {
          d_id = Math.floor(Math.random() * state.driverNumber + 1);
        } while (
          state.drivers.has(d_id) &&
          state.drivers.get(d_id).passengers.size > state.kValue &&
          !state.drivers.get(d_id).isValid
        );
        // 如果司机id不存在则随机生成一个
        if (!state.drivers.has(d_id)) {
          driver = new Driver(d_id);
          driver.passengers.set(passenger_order.id, passenger);
          state.drivers.set(d_id, driver);
        } else {
          driver = state.drivers.get(d_id);
          // update drivers
          // 订单排序
          let passengers = driver.passengers;
          passengers.set(passenger_order.id, passenger);
          // passengers = new Map(
          //   Array.from(passengers)
          //     .sort((a, b) => b[1].score - a[1].score)
          //     .map((i) => [i[0], i[1]])
          // );
          driver.passengers = passengers;
          // todo get + set 导致赋值无效
          state.drivers.set(d_id, driver);
        }
      }
      /**
       * 剔除并统计过期订单
       */
      for (let [key, value] of state.passengers.entries()) {
        if (value.end_timestamp <= timeTo)
          state.passengers.get(key).isValid = false;
        outdated_passenger_order_number++;
      }
      if (
        outdated_passenger_order_number > state.outdated_passenger_order_number
      )
        state.outdated_passenger_order_number = outdated_passenger_order_number;
      else
        state.outdated_passenger_order_number += Math.floor(
          Math.random() * (50 - 1 + 1) + 1
        );
      /**
       * 剔除司机中过期订单
       */
      // for (let d_id of state.drivers.keys()) {
      //   for (let [p_id, passenger] of state.drivers
      //     .get(d_id)
      //     .passengers.entries()) {
      //     if (!passenger.isValid)
      //       state.drivers.get(d_id).passengers.delete(p_id);
      //   }
      // }
      // sort drivers
      // state.drivers = new Map(
      //   Array.from(state.drivers)
      //     .sort((a, b) => a[0] - b[0])
      //     .map((i) => [i[0], i[1]])
      // );

      /*  let driver = null;
      let passenger = null;
      do {
        driver = new Driver(state.driverNumber, state.bounds, state.center);
        passenger = new Passenger(
          state.passengerNumber,
          state.bounds,
          state.center
        );
        state.matches.push({
          driver,
          passenger,
          timestamp: payload.timestamp,
        });
      } while (selectMatch([driver.id, passenger.id]).length);
      insertMatch([
        driver.id,
        driver.name,
        driver.avatar,
        ...driver.origin_pos,
        ...driver.dist_pos,
        passenger.id,
        passenger.name,
        passenger.avatar,
        ...passenger.pick_up_pos,
        ...passenger.pick_off_pos,
        passenger.score,
        payload.timestamp,
      ]);

      // insert new passenger
      if (!state.passengers.has(passenger.id)) {
        state.passengers.set(passenger.id, {
          id: passenger.id,
          name: passenger.name,
          avatar: passenger.avatar,
          pick_up_pos: passenger.pick_up_pos,
          pick_off_pos: passenger.pick_off_pos,
        });
      }
      // insert new driver
      if (!state.drivers.has(driver.id)) {
        state.drivers.set(driver.id, {
          ...driver,
          passengers: new Map(),
        });
      }
      // update drivers
      let passengers = state.drivers.get(driver.id).passengers;
      passengers.set(passenger.id, {
        ...passenger,
        timestamp: payload.timestamp,
      });
      passengers = new Map(
        Array.from(passengers)
          .sort((a, b) => b[1].score - a[1].score)
          .map((i) => [i[0], i[1]])
      );
      state.drivers.set(driver.id, {
        ...driver,
        passengers: passengers,
      });
      // sort drivers
      state.drivers = new Map(
        Array.from(state.drivers)
          .sort((a, b) => a[0] - b[0])
          .map((i) => [i[0], i[1]])
      );
      state.current_timestamp = payload.timestamp; */
    },
    genOrder(state, payload) {
      if (state.drivers.size) {
        let driver;
        let passenger;
        do {
          driver = Array.from(state.drivers)[
            Math.floor(Math.random() * state.drivers.size)
          ][1];
        } while (!driver.passengers.size);
        passenger = Array.from(driver.passengers)[0][1];
        let order = {
          driver: {
            id: driver.id,
            origin_pos: driver.origin_pos,
            dist_pos: driver.dist_pos,
          },
          passenger: {
            id: passenger.id,
            pick_up_pos: passenger.pick_up_pos,
            pick_off_pos: passenger.pick_off_pos,
          },
        };
        state.orders.set(driver.id, order);
        state.drivers.get(driver.id).isValid = false;
        state.passengers.get(passenger.id).isValid = false;
        state.processing_time += payload.timestamp - passenger.start_timestamp;
      }
      /* // gen new order
      let match =
        state.matches[Math.floor(Math.random() * state.matches.length)];
      if (!match) return;
      let driver = match.driver;
      let passenger = match.passenger;
      let order = {
        driver,
        passenger,
        timestamp: payload.timestamp,
      };
      state.orders.push(order);
      // insert order
      insertOrder([
        driver.id,
        driver.name,
        driver.avatar,
        ...driver.origin_pos,
        ...driver.dist_pos,
        passenger.id,
        passenger.name,
        passenger.avatar,
        ...passenger.pick_up_pos,
        ...passenger.pick_off_pos,
        passenger.score,
        payload.timestamp,
      ]);
      // update matches
      state.matches = [];
      state.drivers = new Map();
      state.passengers = new Map();
      let list_match_stmt = listMatch();
      while (list_match_stmt.step()) {
        let res = list_match_stmt.getAsObject();
        let driver = {
          id: res.d_id,
          name: res.d_name,
          avatar: res.d_avatar,
          origin_pos: [res.origin_lng, res.origin_lat],
          dist_pos: [res.dist_lng, res.dist_lat],
        };
        let passenger = {
          id: res.p_id,
          name: res.p_name,
          avatar: res.p_avatar,
          pick_up_pos: [res.pick_up_lng, res.pick_up_lat],
          pick_off_pos: [res.pick_off_lng, res.pick_off_lat],
          score: res.score,
        };
        state.matches.push({
          driver,
          passenger,
          timestamp: res.timestamp,
        });

        // insert new passenger
        if (!state.passengers.has(passenger.id)) {
          state.passengers.set(passenger.id, {
            id: passenger.id,
            name: passenger.name,
            avatar: passenger.avatar,
            pick_up_pos: passenger.pick_up_pos,
            pick_off_pos: passenger.pick_off_pos,
          });
        }
        // insert new driver
        if (!state.drivers.has(driver.id)) {
          state.drivers.set(driver.id, {
            ...driver,
            passengers: new Map(),
          });
        }
        // update drivers
        let passengers = state.drivers.get(driver.id).passengers;
        passengers.set(passenger.id, {
          ...passenger,
          timestamp: res.timestamp,
        });
        passengers = new Map(
          Array.from(passengers)
            .sort((a, b) => b[1].score - a[1].score)
            .map((i) => [i[0], i[1]])
        );
        state.drivers.set(driver.id, {
          ...driver,
          passengers: passengers,
        });
      }
      // sort drivers
      state.drivers = new Map(
        Array.from(state.drivers)
          .sort((a, b) => a[0] - b[0])
          .map((i) => [i[0], i[1]])
      ); */
    },
    setDriverList(state, payload) {
      state.driverlist = payload;
    },
  },
  getters: {
    getPassengerOrders(state) {
      return state.passengers;
    },
    getPassengers(state) {
      return state.passengers;
    },
    getDrivers(state) {
      return state.drivers;
    },
    getOrders(state) {
      return state.orders;
    },
    getDriverList(state) {
      return state.driverlist;
    },
    getPassengerOrderNumber(state) {
      return state.passenger_order_number;
    },
    getOutdatedPassengerOrderNumber(state) {
      return state.outdated_passenger_order_number;
    },
    getNewPassengerOrderNumber(state) {
      return state.new_passenger_order_number;
    },
    getProcessingTime(state) {
      return state.processing_time;
    },
  },
  actions: {
    setParams({ commit }, payload) {
      commit("setParams", payload);
    },
    genPassengerOrder({ commit }, payload) {
      commit("genPassengerOrder", payload);
    },
    genOrder({ commit }, payload) {
      commit("genOrder", payload);
    },
    setDriverList({ commit }, payload) {
      commit("setDriverList", payload);
    },
  },
  modules: {},
});
