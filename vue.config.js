const { defineConfig } = require('@vue/cli-service')
const ENV = window.__ENV || {};
const API_BASE = ENV.VUE_APP_BE || process.env.VUE_APP_BE;

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.VUE_APP_PUBLIC,
  devServer: {
    proxy: API_BASE
  },
  pages: {
    index: {
      entry: 'src/main.js',
      title: process.env.VUE_APP_NAME
    }
  }
})
