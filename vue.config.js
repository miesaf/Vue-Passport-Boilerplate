const { defineConfig } = require('@vue/cli-service')

// NOTE:
// vue.config.js runs in Node.js during build, so `window` is NOT available here.
// Use only process.env.* in this file.
const API_BASE = process.env.VUE_APP_BE || 'http://localhost/api/'

module.exports = defineConfig({
  transpileDependencies: true,

  // Safe default so build won't break if env is missing
  publicPath: process.env.VUE_APP_PUBLIC || './',

  devServer: {
    // Vue CLI proxy expects an object or string. String works but object is safer.
    proxy: {
      '/api': {
        target: API_BASE.replace(/\/api\/?$/, ''), // if API_BASE ends with /api, strip it
        changeOrigin: true,
        secure: false,
      },
    },
  },

  pages: {
    index: {
      entry: 'src/main.js',
      title: process.env.VUE_APP_NAME || 'Vue + Laravel Passport Boilerplate',
    },
  },
})
