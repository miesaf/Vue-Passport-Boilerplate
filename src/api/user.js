import request from '@/utilities/request'

// User
export function getUsers () {
  return request({
    url: '/users',
    method: 'get'
  })
}

export function storeUser (reqObj) {
  return request({
    url: '/users',
    method: 'post',
    data: reqObj
  })
}

export function getUser (id) {
  return request({
    url: '/users/' + id,
    method: 'get'
  })
}

export function updateUser (id, reqObj) {
  return request({
    url: '/users/' + id,
    method: 'put',
    data: reqObj
  })
}

export function deleteUser (id) {
  return request({
    url: '/users/' + id,
    method: 'delete'
  })
}
