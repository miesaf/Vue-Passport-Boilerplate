import request from '@/utilities/request'

// Common service API
export function getOptions () {
  return request({
    url: '/options',
    method: 'get'
  })
}