import axios from 'axios'
import store from '@/store'
import { getToken } from '@/utilities/auth'
import moment from 'moment'

const service = axios.create({
  baseURL: process.env.VUE_APP_BE,
  timeout: 15000,   // miliseconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  validateStatus: function (status) {
    if(status >= 200 && status < 400) { return true }
    if(status == 401) { return true } // Unauthenticated
    if(status == 403) { return true } // Insufficient permissions
    if(status == 422) { return true } // Laravel validation error
    if(status == 429) { return true } // Laravel throttle error
    if(status == 500) { return true } // Internal Server Error
    if(status == 503) { return true } // Service Unavailable
  }
})

// request
service.interceptors.request.use(
  async config => {
    var logoutFlag = false
    if (await store.getters.token) {
      const now_raw = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      var now = moment(now_raw).format("YYYY-MM-DD HH:mm:ss")
      var ttl = store.getters.authExpiresOn
      var refreshTtl = store.getters.refreshExpiresOn

      process.env.NODE_ENV === 'production' ? null : console.log("[DEBUG] Token expire on: " + ttl)
      process.env.NODE_ENV === 'production' ? null : console.log("[DEBUG] Refresh token expire on: " + refreshTtl)

      // Check if time has passed TTL
      if (moment(now).isAfter(refreshTtl)) {
        await process.env.NODE_ENV === 'production' ? null : console.log("[DEBUG] Logged out due to time has passed token TTL")
        logoutFlag = true
      } else {
        // Refresh
        if (moment(now).isAfter(moment(ttl).format("YYYY-MM-DD HH:mm:ss"))) {
          try {
            await store
              .dispatch("RefreshTokenDua")
              .then(() => {
                // Token successfuly refreshed
                process.env.NODE_ENV === 'production' ? console.info("Token successfully refreshed") : console.log("[DEBUG] Token successfully refreshed by request interceptors")
              }).then(() => {
                process.env.NODE_ENV === 'production' ? null : console.log("[DEBUG] Token used: " + getToken())
                config.headers['Authorization'] = 'Bearer ' + getToken()
              })
              .catch(() => {
                console.error("Token refresh failed")
                // return Promise.reject()
                logoutFlag = true
              })
          } catch (error) {
            console.error(error)
            logoutFlag = true
          }
        } else {
          config.headers['Authorization'] = 'Bearer ' + getToken()
        }
      }

      if(logoutFlag) {
        await store.dispatch("Logout")
        await store.dispatch("ServiceNotify", { message: "Session expired. Please re-login.", class: "error" })
        await new Promise(r => setTimeout(r, 2000))
        await window.location.replace(process.env.VUE_APP_URL)
      }
    }

    return await config
  },
  error => {
    // Do something with request error
    Promise.reject(error)
  }
)

// response
service.interceptors.response.use(async function (response) {
  switch(response.status) {
    case 401:
      await store.dispatch("Logout")
      await store.dispatch("ServiceNotify", { message: "Session expired. Please re-login.", class: "error" })
      await new Promise(r => setTimeout(r, 2000))
      await window.location.replace(process.env.VUE_APP_URL)
      break
    case 403:
      await store.dispatch("ServiceNotify", { message: "Insufficient permission. Request rejected.", class: "error" })
      break
    case 429:
      await store.dispatch("ServiceNotify", { message: response.data.message, class: "error" })
      break
    case 500:
      await store.dispatch("ServiceNotify", { message: "Back end service error.", class: "error" })
      break
    case 503:
      await store.dispatch("ServiceNotify", { message: "Back end service unavailable. Please try again later. If problem persist report to system administrator.", class: "error" })
      break
    default:
      // do nothing
  }

  return await response
}, function (error) {
  // Unresolved request
  Promise.reject(error)
})

export default service
