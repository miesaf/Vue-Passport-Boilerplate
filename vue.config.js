const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.VUE_APP_PUBLIC,
  devServer: {
    proxy: process.env.VUE_APP_BE
  },
  pages: {
    index: {
      entry: 'src/main.js',
      title: process.env.VUE_APP_NAME
    }
  }
})
