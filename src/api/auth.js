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
