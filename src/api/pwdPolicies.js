import request from '@/utilities/request'

// Password Policies
export function getPwdPolicies () {
  return request({
    url: '/pwdPolicies',
    method: 'get'
  })
}

export function getPwdPolicy (id) {
  return request({
    url: '/pwdPolicies/' + id,
    method: 'get'
  })
}

export function updatePwdPolicy (id, reqObj) {
  return request({
    url: '/pwdPolicies/' + id,
    method: 'put',
    data: reqObj
  })
}
