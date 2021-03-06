import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/admin/reply/lists',
    method: 'get',
    params: query
  })
}

export function updateReply(data) {
  return request({
    url: '/admin/reply/update',
    method: 'get',
    params: data
  })
}

export function deleteReply(data) {
  return request({
    url: '/admin/reply/delete',
    method: 'get',
    params: data
  })
}
