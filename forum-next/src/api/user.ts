import request from '@/utils/request'
import type {
  requestRegister,
  requestLogin,
  requestRereshToken,
  requestCancelAttention,
  requestAttention,
  requestCancelCollection,
  requestCollection,
  requestHistory,
  requestFeedback,
  requestModifyPassword,
} from '@/types/request/user'

export function register(data: requestRegister) {
  return request({
    url: '/front/user/register',
    method: 'post',
    data,
  })
}

export function login(data: requestLogin) {
  return request({
    url: '/front/user/login',
    method: 'post',
    data,
  })
}

export function refreshToken(data: requestRereshToken) {
  return request({
    url: '/front/user/refresh_token',
    method: 'post',
    data,
  })
}

export function getUserInfo() {
  return request({
    url: '/front/user/get_user_info',
    method: 'get',
  })
}

export function cancelAttention(data: requestCancelAttention) {
  return request({
    url: '/front/user/cancel_attention',
    method: 'get',
    params: data,
  })
}

export function attention(data: requestAttention) {
  return request({
    url: '/front/user/attention',
    method: 'get',
    params: data,
  })
}

export function calcelCollection(data: requestCancelCollection) {
  return request({
    url: '/front/user/calcel_collection',
    method: 'get',
    params: data,
  })
}

export function collection(data: requestCollection) {
  return request({
    url: '/front/user/collection',
    method: 'get',
    params: data,
  })
}

export function history(data: requestHistory) {
  return request({
    url: '/front/user/history',
    method: 'get',
    params: data,
  })
}

export function feedback(data: requestFeedback) {
  return request({
    url: '/front/user/feedback',
    method: 'get',
    params: data,
  })
}

export function modifyPassword(data: requestModifyPassword) {
  return request({
    url: '/front/user/modify_password',
    method: 'post',
    data,
  })
}
