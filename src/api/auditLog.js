import request from '@/utilities/request'

// Audit Log
export function getAuditLogs () {
  return request({
    url: '/auditLogs',
    method: 'get'
  })
}

export function getAuditLog (id) {
  return request({
    url: '/auditLogs/' + id,
    method: 'get'
  })
}

export function searchAuditLogs (obj) {
  return request({
    url: '/auditLogs/search',
    method: 'post',
    data: obj
  })
}
