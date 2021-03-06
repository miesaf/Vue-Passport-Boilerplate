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
    return (status >= 200 && status < 400)
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
              .dispatch("RefreshToken")
              .then(() => {
                // Token successfuly refreshed
                process.env.NODE_ENV === 'production' ? console.info("Token successfully refreshed") : console.log("[DEBUG] Token successfully refreshed by request interceptors")
              }).then(() => {
                process.env.NODE_ENV === 'production' ? null : console.log("[DEBUG] Token used: " + getToken())
                config.headers['Authorization'] = 'Bearer ' + getToken()
              })
              .catch(() => {
                console.error("Token refresh failed")
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
        await store.dispatch("ServiceNotify", { message: "Session expired. Please re-login.", class: "danger" })
        await new Promise(r => setTimeout(r, 2000))
        await window.location.replace(process.env.VUE_APP_URL)
      }
    }

    return await config
  },
  error => {
    // Do nothing
    return Promise.reject(error)
  }
)

// response
service.interceptors.response.use(async function (response) {
  // Do nothing
  return await response
}, async function (error) {
  // Unresolved request
  switch(error.status) {
    case 401: // Unauthenticated
      await store.dispatch("Logout")
      await store.dispatch("ServiceNotify", { message: "Session expired. Please re-login.", class: "danger" })
      await new Promise(r => setTimeout(r, 2000))
      await window.location.replace(process.env.VUE_APP_URL)
      break
    case 403: // Insufficient permissions
      await store.dispatch("ServiceNotify", { message: "Insufficient permission. Request rejected.", class: "danger" })
      break
    case 429: // Laravel throttle error
      await store.dispatch("ServiceNotify", { message: error.data.message, class: "danger" })
      break
    case 500: // Internal Server Error
      await store.dispatch("ServiceNotify", { message: "Back end service error.", class: "danger" })
      break
    case 503: // Service Unavailable
      await store.dispatch("ServiceNotify", { message: "Back end service unavailable. Please try again later. If problem persist report to system administrator.", class: "danger" })
      break
    default:
      // do nothing
  }

  return Promise.reject(error)
})

export default service
