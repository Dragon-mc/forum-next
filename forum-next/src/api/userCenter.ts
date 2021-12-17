import request from '@/utils/request'
import type {
  requestUserCenterInfo,
  requestFetchCollection,
  requestFetchPublish,
  requestFetchDraftPost,
  requestFetchAttention,
  requestFetchFans,
  requestFetchHistory,
  requestModifyProfile,
} from '@/types/request/userCenter'

export function getUserCenterInfo(data: requestUserCenterInfo) {
  return request({
    url: '/front/user_center/get_user_info',
    method: 'get',
    params: data,
  })
}

export function fetchCollection(data: requestFetchCollection) {
  return request({
    url: '/front/user_center/fetch_collection',
    method: 'get',
    params: data,
  })
}

export function fetchPublish(data: requestFetchPublish) {
  return request({
    url: '/front/user_center/fetch_publish',
    method: 'get',
    params: data,
  })
}

export function fetchDraftPost(data: requestFetchDraftPost) {
  return request({
    url: '/front/user_center/fetch_draft_post',
    method: 'get',
    params: data,
  })
}

export function fetchAttention(data: requestFetchAttention) {
  return request({
    url: '/front/user_center/fetch_attention',
    method: 'get',
    params: data,
  })
}

export function fetchFans(data: requestFetchFans) {
  return request({
    url: '/front/user_center/fetch_fans',
    method: 'get',
    params: data,
  })
}

export function fetchHistory(data: requestFetchHistory) {
  return request({
    url: '/front/user_center/fetch_history',
    method: 'get',
    params: data,
  })
}

export function modifyProfile(data: requestModifyProfile) {
  return request({
    url: '/front/user_center/modify_profile',
    method: 'post',
    data,
  })
}

export function uploadAvatar(data: FormData) {
  return request({
    url: '/front/user_center/upload_avatar',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data,
  })
}
