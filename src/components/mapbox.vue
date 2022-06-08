<template>
  <el-container ID="mapbox"></el-container>
</template>

<script>
import AMap from "AMap"; // 引入高德地图
export default {
  props: ["isNight"],

  mounted() {
    this.init();
  },
  data() {
    return {
      map: null,
      driver_marker_list: [],
      passenger_marker_list: [],
      order_marker_list: [],
    };
  },
  computed: {
    drivers() {
      return this.$store.getters.getDrivers;
    },
    passengers() {
      return this.$store.getters.getPassengers;
    },
    orders() {
      return this.$store.getters.getOrders;
    },
    driverlist() {
      return this.$store.getters.getDriverList;
    },
  },
  watch: {
    drivers: {
      handler: function (newVal) {
        if (this.map) {
          this.map.remove(this.driver_marker_list);
          this.driver_marker_list = [];
          newVal.forEach((value) => {
            if (value.isValid) {
              let marker = new AMap.Marker({
                icon: new AMap.Icon({
                  size: new AMap.Size(20, 20), // 图标尺寸
                  image:
                    "https://gitee.com/InfiniteNightmare/album/raw/master/img/empty-car-unfocused.png", // Icon的图像
                  imageOffset: new AMap.Pixel(0, 0), // 图像相对展示区域的偏移量，适于雪碧图等
                  imageSize: new AMap.Size(20, 20), // 根据所设置的大小拉伸或压缩图片
                }),
                position: new AMap.LngLat(...value.origin_pos),
                title: `id: ${value.id}\nPos: ${value.origin_pos[0].toFixed(
                  4
                )}, ${value.origin_pos[1].toFixed(4)}`,
                extData: value.id,
              });
              marker.on("rightclick", (e) => {
                let contextMenu = new AMap.ContextMenu();
                contextMenu.addItem(
                  "track",
                  () => {
                    let driving = new AMap.Driving({
                      map: this.map,
                      showTraffic: false,
                      hideMarkers: true,
                      autoFitView: false,
                    });
                    driving.search(
                      new AMap.LngLat(...value.origin_pos),
                      new AMap.LngLat(...value.dist_pos),
                      (status, result) => {
                        if (status != "complete")
                          this.$message({
                            message: "Failed to obtain driving data: " + result,
                            type: "error",
                          });
                      }
                    );
                    setTimeout(() => {
                      driving.clear();
                    }, 5000);
                    contextMenu.close();
                  },
                  0
                );
                // contextMenu.addItem(
                //   "watch",
                //   () => {
                //     let driverList =
                //       this.driverList === undefined ? [] : this.driverList;
                //     driverList.push(value.id);
                //     this.setDriverList(driverList);
                //     console.log(driverList);
                //     contextMenu.close();
                //   },
                //   1
                // );
                contextMenu.open(this.map, e.lnglat);
              });
              this.driver_marker_list.push(marker);
            }
          });
          this.map.add(this.driver_marker_list);
        }
      },
      deep: true,
      immediate: true,
    },
    passengers: {
      handler: function (newVal) {
        if (this.map) {
          this.map.remove(this.passenger_marker_list);
          this.passenger_marker_list = [];
          newVal.forEach((value) => {
            if (value.isValid) {
              let marker = new AMap.Marker({
                icon: new AMap.Icon({
                  size: new AMap.Size(20, 20), // 图标尺寸
                  image:
                    "https://gitee.com/InfiniteNightmare/album/raw/master/img/passenger.png", // Icon的图像
                  imageOffset: new AMap.Pixel(0, 0), // 图像相对展示区域的偏移量，适于雪碧图等
                  imageSize: new AMap.Size(20, 20), // 根据所设置的大小拉伸或压缩图片
                }),
                position: new AMap.LngLat(...value.pick_up_pos),
                title: `id: ${value.id}\nPos: ${value.pick_up_pos[0].toFixed(
                  4
                )}, ${value.pick_up_pos[1].toFixed(4)}`,
              });
              marker.on("rightclick", (e) => {
                let contextMenu = new AMap.ContextMenu();
                contextMenu.addItem(
                  "track",
                  () => {
                    let driving = new AMap.Driving({
                      map: this.map,
                      showTraffic: false,
                      hideMarkers: true,
                      autoFitView: false,
                    });
                    driving.search(
                      new AMap.LngLat(...value.pick_up_pos),
                      new AMap.LngLat(...value.pick_off_pos),
                      (status, result) => {
                        if (status != "complete")
                          this.$message({
                            message: "Failed to obtain driving data: " + result,
                            type: "error",
                          });
                      }
                    );
                    setTimeout(() => {
                      driving.clear();
                    }, 5000);
                    contextMenu.close();
                  },
                  0
                );
                contextMenu.open(this.map, e.lnglat);
              });
              this.passenger_marker_list.push(marker);
            }
          });
          this.map.add(this.passenger_marker_list);
        }
      },
      deep: true,
      immediate: true,
    },
    orders: {
      handler: function (newVal) {
        if (this.map) {
          newVal.forEach((value) => {
            let marker = new AMap.Marker({
              map: this.map,
              icon: new AMap.Icon({
                size: new AMap.Size(16, 32), // 图标尺寸
                image:
                  "https://a.amap.com/jsapi_demos/static/demo-center-v2/car.png", // Icon的图像
                imageOffset: new AMap.Pixel(0, 0), // 图像相对展示区域的偏移量，适于雪碧图等
                imageSize: new AMap.Size(16, 32), // 根据所设置的大小拉伸或压缩图片
              }),
              offset: new AMap.Pixel(-8, -16),
              position: new AMap.LngLat(...value.driver.origin_pos),
              title: `Driver ID: ${value.driver.id}\nOrder ID: ${
                value.passenger.id
              }\nPos: ${value.driver.origin_pos[0].toFixed(
                4
              )}, ${value.driver.origin_pos[1].toFixed(4)}`,
            });

            marker.on("rightclick", (e) => {
              let contextMenu = new AMap.ContextMenu();
              contextMenu.addItem(
                "track",
                () => {
                  let drivings = new Array(3);
                  let points = new Array(3);
                  let passedPolylines = new Array(3);
                  let path_no = 0;
                  marker.on("moving", (e) => {
                    passedPolylines[path_no].setPath(e.passedPath);
                  });
                  for (let i = 0; i < 3; i++) {
                    drivings[i] = new AMap.Driving({
                      map: this.map,
                      showTraffic: false,
                      hideMarkers: true,
                      autoFitView: false,
                    });
                    points[i] = [];
                    passedPolylines[i] = new AMap.Polyline({
                      map: this.map,
                      strokeColor: "#AF5", //线颜色
                      strokeWeight: 6, //线宽
                      zIndex: 99,
                    });
                  }
                  drivings[0].search(
                    new AMap.LngLat(...value.driver.origin_pos),
                    new AMap.LngLat(...value.passenger.pick_up_pos),
                    (status, result) => {
                      if (status == "complete") {
                        for (
                          let i = 0,
                            i_step = Math.ceil(
                              result.routes[0].steps.length / 20
                            )
                              ? Math.ceil(result.routes[0].steps.length / 20)
                              : 1;
                          i < result.routes[0].steps.length;
                          i += i_step
                        ) {
                          let step = result.routes[0].steps[i];
                          for (
                            let j = 0,
                              j_step = Math.ceil(step.path.length / 4)
                                ? Math.ceil(step.path.length / 4)
                                : 1;
                            j < step.path.length;
                            j += j_step
                          ) {
                            let point = step.path[j];
                            points[0].push([point.lng, point.lat]);
                          }
                        }
                        // for (let step of result.routes[0].steps) {
                        //   for (let point of step.path) {
                        //     points[0].push([point.lng, point.lat]);
                        //   }
                        // }
                        marker.moveAlong(points[0], {
                          // 每一段的时长
                          duration: 1, //可根据实际采集时间间隔设置
                          // JSAPI2.0 是否延道路自动设置角度在 moveAlong 里设置
                          autoRotation: true,
                        });
                        marker.on("movealong", function movealong_func1() {
                          for (let i = 0; i < 6; i++) {
                            setTimeout(() => {
                              if (i & 1) {
                                marker.show();
                                marker.off("movealong", movealong_func1);
                                if (i == 6 - 1) {
                                  path_no = 1;
                                  setTimeout(() => {
                                    marker.moveAlong(points[1], {
                                      // 每一段的时长
                                      duration: 1, //可根据实际采集时间间隔设置
                                      // JSAPI2.0 是否延道路自动设置角度在 moveAlong 里设置
                                      autoRotation: true,
                                    });
                                  }, 300);
                                  marker.on(
                                    "movealong",
                                    function movealong_func2() {
                                      for (let i = 0; i < 6; i++) {
                                        setTimeout(() => {
                                          if (i & 1) {
                                            marker.show();
                                            marker.off(
                                              "movealong",
                                              movealong_func2
                                            );
                                            if (i == 6 - 1) {
                                              path_no = 2;
                                              setTimeout(() => {
                                                marker.moveAlong(points[2], {
                                                  // 每一段的时长
                                                  duration: 1, //可根据实际采集时间间隔设置
                                                  // JSAPI2.0 是否延道路自动设置角度在 moveAlong 里设置
                                                  autoRotation: true,
                                                });
                                              }, 300);
                                              marker.on(
                                                "movealong",
                                                function movealong_func2() {
                                                  setTimeout(() => {
                                                    for (
                                                      let i = 0;
                                                      i < 3;
                                                      i++
                                                    ) {
                                                      drivings[i].clear();
                                                      passedPolylines[i].hide();
                                                    }
                                                    marker.setPosition(
                                                      value.driver.origin_pos
                                                    );
                                                  }, 2000);
                                                  contextMenu.close();
                                                }
                                              );
                                            }
                                          } else {
                                            marker.hide();
                                          }
                                        }, i * 300);
                                      }
                                    }
                                  );
                                }
                              } else {
                                marker.hide();
                              }
                            }, i * 300);
                          }
                        });
                      } else
                        this.$message({
                          message: "Failed to obtain driving data: " + result,
                          type: "error",
                        });
                    }
                  );
                  drivings[1].search(
                    new AMap.LngLat(...value.passenger.pick_up_pos),
                    new AMap.LngLat(...value.passenger.pick_off_pos),
                    (status, result) => {
                      if (status == "complete") {
                        for (
                          let i = 0,
                            i_step = Math.ceil(
                              result.routes[0].steps.length / 20
                            )
                              ? Math.ceil(result.routes[0].steps.length / 20)
                              : 1;
                          i < result.routes[0].steps.length;
                          i += i_step
                        ) {
                          let step = result.routes[0].steps[i];
                          for (
                            let j = 0,
                              j_step = Math.ceil(step.path.length / 4)
                                ? Math.ceil(step.path.length / 4)
                                : 1;
                            j < step.path.length;
                            j += j_step
                          ) {
                            let point = step.path[j];
                            points[1].push([point.lng, point.lat]);
                          }
                        }
                        // for (let step of result.routes[0].steps) {
                        //   for (let point of step.path) {
                        //     points[1].push([point.lng, point.lat]);
                        //   }
                        // }
                      }
                    }
                  );
                  drivings[2].search(
                    new AMap.LngLat(...value.passenger.pick_off_pos),
                    new AMap.LngLat(...value.driver.dist_pos),
                    (status, result) => {
                      if (status == "complete") {
                        // this.map.setFitView();
                        for (
                          let i = 0,
                            i_step = Math.ceil(
                              result.routes[0].steps.length / 20
                            )
                              ? Math.ceil(result.routes[0].steps.length / 20)
                              : 1;
                          i < result.routes[0].steps.length;
                          i += i_step
                        ) {
                          let step = result.routes[0].steps[i];
                          for (
                            let j = 0,
                              j_step = Math.ceil(step.path.length / 4)
                                ? Math.ceil(step.path.length / 4)
                                : 1;
                            j < step.path.length;
                            j += j_step
                          ) {
                            let point = step.path[j];
                            points[2].push([point.lng, point.lat]);
                          }
                        }
                        // for (let step of result.routes[0].steps) {
                        //   for (let point of step.path) {
                        //     points[2].push([point.lng, point.lat]);
                        //   }
                        // }
                      }
                    }
                  );
                  contextMenu.close();
                },
                0
              );
              contextMenu.open(this.map, e.lnglat);
            });
          });
        }
      },
      deep: true,
      immediate: true,
    },
    // driverlist: {
    //   handler: function (newVal) {
    //     if (this.map) {
    //       this.map.remove(this.driver_marker_list);
    //       for (let i = 0; i < this.driver_marker_list.length; i++) {
    //         this.driver_marker_list[i].setIcon(
    //           new AMap.Icon({
    //             size: new AMap.Size(20, 20), // 图标尺寸
    //             image: (() => {
    //               if (newVal == null) return false;
    //               for (let ID of newVal)
    //                 if (this.driver_marker_list[i].getExtData() == ID)
    //                   return true;
    //               return false;
    //             })()
    //               ? "https://gitee.com/InfiniteNightmare/album/raw/master/img/empty-car.png"
    //               : "https://gitee.com/InfiniteNightmare/album/raw/master/img/empty-car-unfocused.png", // Icon的图像
    //             imageOffset: new AMap.Pixel(0, 0), // 图像相对展示区域的偏移量，适于雪碧图等
    //             imageSize: new AMap.Size(20, 20), // 根据所设置的大小拉伸或压缩图片
    //           })
    //         );
    //       }
    //       this.map.add(this.driver_marker_list);
    //     }
    //   },
    // },

    // isNight: {
    //   handler: function (newVal) {
    //     if (newVal) {
    //       this.map.setMapStyle("amap://styles/darkblue");
    //     } else {
    //       this.map.setMapStyle("amap://styles/normal");
    //     }
    //   },
    // },
  },
  methods: {
    init() {
      this.map = new AMap.Map("mapbox", {
        mapStyle: "amap://styles/d68208a952fa454a0e4453b8dbdaf282",
        center: [104.07, 30.65],
        lang: "en",
        resizeEnable: true,
        zoom: 14,
      });
      AMap.plugin(["AMap.Driving", "AMap.MoveAnimation"], () => {});
    },
    setDriverList(driverList) {
      this.$store.dispatch("setDriverList", {
        driverList,
      });
    },
  },
};
</script>

<style lang="less">
#mapbox {
  position: absolute;
  width: inherit;
  height: inherit;
}
</style>
