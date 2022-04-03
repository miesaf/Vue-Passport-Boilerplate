import axios from 'axios'
import { me } from '@/api/auth'
import { getAuthMaxAttempt, setAuthMaxAttempt, removeAuthMaxAttempt } from '@/utilities/auth'
import { getAuthAttempt, setAuthAttempt, removeAuthAttempt } from '@/utilities/auth'
import { getAuthGrace, setAuthGrace, removeAuthGrace } from '@/utilities/auth'
import { getToken, setToken, removeToken } from '@/utilities/auth'
import { getAuthExpiresOn, setAuthExpiresOn, removeAuthExpiresOn } from '@/utilities/auth'
import { getRefreshToken, setRefreshToken, removeRefreshToken } from '@/utilities/auth'
import { getRefreshExpiresOn, setRefreshExpiresOn, removeRefreshExpiresOn } from '@/utilities/auth'
import moment from "moment";

const user = {
  state: {
    authMaxAttempt: getAuthMaxAttempt(),
    authAttempt: getAuthAttempt(),
    authGrace: getAuthGrace(),
    token: getToken(),
    authExpiresOn: getAuthExpiresOn(),
    refreshToken: getRefreshToken(),
    refreshExpiresOn: getRefreshExpiresOn(),
    authUserId: '',
    authName: '',
    authEmail: '',
    authRoles: '',
    authPermissions: '',
    authLastLogin: ''
  },

  mutations: {
    SET_AUTH_MAX_ATTEMPT: (state, authMaxAttempt) => { state.authMaxAttempt = authMaxAttempt },
    SET_AUTH_ATTEMPT: (state, authAttempt) => { state.authAttempt = authAttempt },
    SET_AUTH_GRACE: (state, authGrace) => { state.authGrace = authGrace },
    SET_TOKEN: (state, token) => { state.token = token },
    SET_AUTHEXPIRESON: (state, authExpiresOn) => { state.authExpiresOn = authExpiresOn },
    SET_REFRESH_TOKEN: (state, refreshToken) => { state.refreshToken = refreshToken },
    SET_REFRESHEXPIRESON: (state, refreshExpiresOn) => { state.refreshExpiresOn = refreshExpiresOn },
    SET_AUTHLOGINID: (state, authUserId) => { state.authUserId = authUserId },
    SET_AUTHNAME: (state, authName) => { state.authName = authName },
    SET_AUTHEMAIL: (state, authEmail) => { state.authEmail = authEmail },
    SET_AUTHROLES: (state, authRoles) => { state.authRoles = authRoles },
    SET_AUTHPERMISSIONS: (state, authPermissions) => { state.authPermissions = authPermissions },
    SET_AUTHLASTLOGIN: (state, authLastLogin) => { state.authLastLogin = authLastLogin }
  },

  actions: {
    Login ({ commit }, usrdet) {
      const token = usrdet.token
      const data = usrdet.user
      const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      
      var ttl = token.expires_in ? token.expires_in : 0
      var token_expire = moment(now).add(ttl, "seconds")

      var refreshTtl = token.refresh_expires_in ? token.refresh_expires_in : 0
      var refresh_expire = moment(now).add(refreshTtl, "seconds")

      setToken(token.access_token)
      commit('SET_TOKEN', token.access_token)

      setAuthExpiresOn(token_expire.format("YYYY-MM-DD HH:mm:ss"))
      commit('SET_AUTHEXPIRESON', token_expire.format("YYYY-MM-DD HH:mm:ss"))

      setRefreshToken(token.refresh_token)
      commit('SET_REFRESH_TOKEN', token.refresh_token)

      setRefreshExpiresOn(refresh_expire.format("YYYY-MM-DD HH:mm:ss"))
      commit('SET_REFRESHEXPIRESON', refresh_expire.format("YYYY-MM-DD HH:mm:ss"))

      commit('SET_AUTHLOGINID', data.user_id)

      commit('SET_AUTHNAME', data.name)

      commit('SET_AUTHEMAIL', data.email)

      var roles = []
      data.roles.forEach(element => {
        roles.push(element.name)
      })
      commit('SET_AUTHROLES', roles.toString().split(','))

      var permissions = []
      data.roles.forEach(element1 => {
        element1.permissions.forEach(element2 => {
          permissions.push(element2.name)
        })
      })
      data.permissions.forEach(element => {
        permissions.push(element.name)
      })
      commit('SET_AUTHPERMISSIONS', permissions.toString().split(','))

      setAuthGrace(null)
      commit('SET_AUTH_GRACE', null)

      setAuthAttempt(null)
      commit('SET_AUTH_ATTEMPT', null)

      removeAuthGrace()
      removeAuthAttempt()
    },

    LoginAttmept ({ commit }, data) {
      if('max_attempt' in data) {
        const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        const attempt = getAuthAttempt()
        var currAttempt = (attempt ? parseInt(attempt) : 0) + 1

        setAuthMaxAttempt(data.max_attempt)
        commit('SET_AUTH_MAX_ATTEMPT', data.max_attempt)

        setAuthAttempt(currAttempt)
        commit('SET_AUTH_ATTEMPT', currAttempt)

        if(('grace' in data) && (data.grace > 0)) {
          if(!getAuthGrace()) {
            if(currAttempt >= data.max_attempt) {
              var grace_until = moment(now).add(data.grace, "minutes")

              setAuthGrace(grace_until)
              commit('SET_AUTH_GRACE', grace_until)
            }
          } else {
            const grace_end = moment(getAuthGrace())

            if (moment(now).isAfter(grace_end)) {
              setAuthGrace(null)
              commit('SET_AUTH_GRACE', null)
              removeAuthGrace()
            }
          }
        }

        if(currAttempt >= data.max_attempt) {
          setAuthAttempt(null)
          commit('SET_AUTH_ATTEMPT', null)
          removeAuthAttempt()
        }
      } else {
        setAuthMaxAttempt(null)
        commit('SET_AUTH_MAX_ATTEMPT', null)
        removeAuthMaxAttempt()

        setAuthAttempt(null)
        commit('SET_AUTH_ATTEMPT', null)
        removeAuthAttempt()

        setAuthGrace(null)
        commit('SET_AUTH_GRACE', null)
        removeAuthGrace()
      }
    },

    RefreshToken ({ commit }) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'post',
          url: process.env.VUE_APP_BE + 'refreshToken',
          data: {
            refresh_token: getRefreshToken()
          }
        })
        .then(resp => {
          const data = resp.data

          if(data.status) {
            const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')

            var ttl = data.token.expires_in ? data.token.expires_in : 0;
            var token_expire = moment(now).add(ttl, "seconds")

            var refreshTtl = data.token.refresh_expires_in ? data.token.refresh_expires_in : 0;
            var refresh_expire = moment(now).add(refreshTtl, "seconds")

            process.env.NODE_ENV === 'production' ? null : console.log("[DEBUG] New token: " + data.token.access_token)

            setToken(data.token.access_token)
            commit('SET_TOKEN', data.token.access_token)

            setAuthExpiresOn(token_expire.format("YYYY-MM-DD HH:mm:ss"))
            commit('SET_AUTHEXPIRESON', token_expire.format("YYYY-MM-DD HH:mm:ss"))

            setRefreshToken(data.token.refresh_token)
            commit('SET_REFRESH_TOKEN', data.token.refresh_token)

            setRefreshExpiresOn(refresh_expire.format("YYYY-MM-DD HH:mm:ss"))
            commit('SET_REFRESHEXPIRESON', refresh_expire.format("YYYY-MM-DD HH:mm:ss"))

            resolve()
          } else {
            reject(data.message)
          }
        })
        .catch(error => {
          console.error(error)
          reject(error)
        })
      })
    },

    async Logout ({ commit }) {
      await setToken(null)
      await commit('SET_TOKEN', null)

      await setAuthExpiresOn(null)
      await commit('SET_AUTHEXPIRESON', null)

      await setRefreshToken(null)
      await commit('SET_REFRESH_TOKEN', null)

      await setRefreshExpiresOn(null)
      await commit('SET_REFRESHEXPIRESON', null)

      await commit('SET_AUTHLOGINID', null)

      await commit('SET_AUTHNAME', null)

      await commit('SET_AUTHEMAIL', null)

      await commit('SET_AUTHROLES', null)

      await commit('SET_AUTHPERMISSIONS', null)

      await commit('SET_AUTHLASTLOGIN', null)

      await commit('SET_OPTIONS', null)

      await removeToken()
      await removeAuthExpiresOn()
      await removeRefreshToken()
      await removeRefreshExpiresOn()
    },

    GetUserInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        me()
          .then(resp => {
            const data = resp.data

            commit('SET_AUTHLOGINID', data.user_id)

            commit('SET_AUTHNAME', data.name)

            commit('SET_AUTHEMAIL', data.email)

            var roles = []
            data.roles.forEach(element => {
              roles.push(element.name)
            })
            commit('SET_AUTHROLES', roles.toString().split(','))

            var permissions = []
            data.roles.forEach(element1 => {
              element1.permissions.forEach(element2 => {
                permissions.push(element2.name)
              })
            })
            data.permissions.forEach(element => {
              permissions.push(element.name)
            })
            commit('SET_AUTHPERMISSIONS', permissions.toString().split(','))

            commit('SET_AUTHLASTLOGIN', moment(data.last_signin).format('YYYY-MM-DD HH:mm:ss'))

            resolve()
          })
          .catch(error => {
            console.error(error)
            reject(error)
          })
      })
    }
  }
}

export default user
