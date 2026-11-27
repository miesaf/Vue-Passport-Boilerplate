import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// The app keeps the VUE_APP_* variable names from its Vue CLI days (.env.local),
// read in code as import.meta.env.VUE_APP_*.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VUE_APP_')

  // Dev server: forward API calls made to the dev origin to the back end, like the old devServer.proxy.
  const proxy = {}
  if (/^https?:\/\//.test(env.VUE_APP_BE || '')) {
    const backEnd = new URL(env.VUE_APP_BE)
    proxy[backEnd.pathname] = { target: backEnd.origin, changeOrigin: true }
  }

  return {
    base: env.VUE_APP_PUBLIC || './',
    envPrefix: 'VUE_APP_',
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      port: 8080,
      proxy
    },
    preview: {
      port: 8080
    },
    build: {
      outDir: 'dist'
    }
  }
})
