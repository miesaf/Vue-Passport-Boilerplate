import request from '@/utilities/request'

// Options
export function getOptions () {
  return request({
    url: '/options/detailed',
    method: 'get'
  })
}

export function getCategories () {
  return request({
    url: '/options/categories',
    method: 'get'
  })
}

export function storeOption (reqObj) {
  return request({
    url: '/options',
    method: 'post',
    data: reqObj
  })
}

export function getOption (id) {
  return request({
    url: '/options/' + id,
    method: 'get'
  })
}

export function updateOption (id, reqObj) {
  return request({
    url: '/options/' + id,
    method: 'put',
    data: reqObj
  })
}

export function deleteOption (id) {
  return request({
    url: '/options/' + id,
    method: 'delete'
  })
}
