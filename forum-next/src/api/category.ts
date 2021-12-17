import request from '@/utils/request'
import type { postRequestParam } from '@/types/request/post'

export function fetchPost (query: postRequestParam) {
  return request({
    url: '/front/category/fetch_post',
    method: 'get',
    params: query
  })
}

export function fetchCategory () {
  return request({
    url: '/front/category/fetch_category',
    method: 'get'
  })
}
