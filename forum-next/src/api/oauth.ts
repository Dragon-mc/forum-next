import request from '@/utils/request'
import type { oauthType, oauthRequest } from '@/types/request/oauth'

// 三方登录
export function oauthLogin(data: oauthRequest) {
  return request({
    url: '/front/oauth/login',
    method: 'post',
    data,
  })
}

export function oauthBind(data: oauthRequest) {
  return request({
    url: '/front/oauth/bind',
    method: 'post',
    data
  })
}

export function oauthUnbind(data: oauthType) {
  return request({
    url: '/front/oauth/unbind',
    method: 'post',
    data
  })
}
