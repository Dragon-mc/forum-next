import request from '@/utils/request'
import type { requestDataParam } from '@/types/request'

export function fetchRecommendPostList (query: requestDataParam) {
  return request({
    url: '/front/index/fetch_recommend_post_list',
    method: 'get',
    params: query
  })
}

export function fetchRankList () {
  return request({
    url: '/front/index/fetch_rank_list',
    method: 'get'
  })
}

export function fetchCateList () {
  return request({
    url: '/front/index/fetch_cate_list',
    method: 'get'
  })
}

export function fetchBrowseRank (data: requestDataParam) {
  return request({
    url: '/front/index/fetch_browse_rank',
    method: 'get',
    params: data
  })
}

export function fetchCommentRank (data: requestDataParam) {
  return request({
    url: '/front/index/fetch_comment_rank',
    method: 'get',
    params: data
  })
}

export function fetchAttentionRank (data: requestDataParam) {
  return request({
    url: '/front/index/fetch_attention_rank',
    method: 'get',
    params: data
  })
}

export function fetchCarouselList () {
  return request({
    url: '/front/index/fetch_carousel_list',
    method: 'get'
  })
}
