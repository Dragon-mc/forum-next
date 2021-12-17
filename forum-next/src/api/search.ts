import request from '@/utils/request'
import type { requestSearchPost } from '@/types/request/search'

export function fetchSearchPost (data: requestSearchPost) {
  return request({
    url: '/front/search/fetch_search_post',
    method: 'get',
    params: data
  })
}
