import request from '@/utilities/request'

// Auth
export function login (reqObj) {
  return request({
    url: '/login',
    method: 'post',
    data: {
      user_id: reqObj.user_id,
      password: reqObj.password
    }
  })
}

export function me () {
  return request({
    url: '/user',
    method: 'get'
  })
}

export function refresh () {
  return request({
    url: '/refreshToken',
    method: 'post',
    data: {
      refresh_token: this.$store.getters.refreshToken,
      hehe: 'huhu'
    }
  })
}

export function logout () {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function firstTimeLogin (pwdObj) {
  return request({
    url: '/password/firstTime',
    method: 'post',
    data: {
      user_id: pwdObj.user_id,
      new_password: pwdObj.new_password
    }
  })
}

export function requestReset (user_id) {
  return request({
    url: '/password/email',
    method: 'post',
    data: {
      user_id: user_id
    }
  })
}

export function checkReset (token) {
  return request({
    url: '/checkReset',
    method: 'post',
    data: {
      token: token,
    }
  })
}

export function reset (reqObj) {
  return request({
    url: '/password/reset',
    method: 'post',
    data: {
      token: reqObj.token,
      new_password: reqObj.new_password
    }
  })
}
