module.exports = {
  publicPath: "./",
  configureWebpack: {
    devtool: "source-map",
    externals: {
      AMap: "AMap", // 高德地图配置
    },
  },
  pluginOptions: {
    "process.env": {
      NODE_ENV: '"development"',
    },
  },
  chainWebpack: (config) => {
    config.module
      .rule("wasm")
      .test(/\.wasm$/)
      .type("javascript/auto");
  },
};
