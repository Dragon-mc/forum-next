import { AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import type { UserInfo } from '@/types/user'
import { history, refreshToken as refreshTokenApi } from '@/api/user'
import moment from 'moment'
import { StorageToken } from '@/enum/storage'
import { DateFormat } from '@/enum'
import request from './request'

// 用户是否登录
export function isLogin(): boolean {
  if (localStorage.getItem(StorageToken.LOGIN_TOKEN)) {
    return true
  }
  return false
}
// 检查登录
export function checkLogin(): boolean {
  const res = isLogin()
  !res && ElMessage.error('请登录后操作！')
  return res
}

// 获取用户信息
export function getUserInfo(): UserInfo {
  const userInfo = localStorage.getItem(StorageToken.USER_INFO_TOKEN)
  return userInfo ? JSON.parse(userInfo) : null
}
// 设置用户信息
export function setUserInfo(userInfo: UserInfo) {
  localStorage.setItem(StorageToken.USER_INFO_TOKEN, JSON.stringify(userInfo))
}
// 删除用户信息
export function delUserInfo() {
  localStorage.removeItem(StorageToken.USER_INFO_TOKEN)
}

// 获取token信息
export function getToken() {
  return localStorage.getItem(StorageToken.LOGIN_TOKEN) || ''
}
// 设置token信息
export function setToken(token: string) {
  localStorage.setItem(StorageToken.LOGIN_TOKEN, token)
}
// 删除token信息
export function delToken() {
  localStorage.removeItem(StorageToken.LOGIN_TOKEN)
}

export function getRefreshToken() {
  return localStorage.getItem(StorageToken.REFRESH_TOKEN) || ''
}
export function setRefreshToken(token: string) {
  localStorage.setItem(StorageToken.REFRESH_TOKEN, token)
}
export function delRefreshToken() {
  localStorage.removeItem(StorageToken.REFRESH_TOKEN)
}

// 退出登录
export function logout() {
  delToken()
  delRefreshToken()
  delUserInfo()
}

// 刷新token
let refreshing = false
const requestingQueue: Array<(valid: boolean, token?: string) => void> = []
export function refreshToken(config: AxiosRequestConfig) {
  if (!refreshing) {
    // 在未请求刷新token时，进行token刷新
    refreshing = true
    const token = getRefreshToken()
    if (token) {
      refreshTokenApi({ token })
        .then(({ data: newToken }) => {
          setToken(newToken)
          requestingQueue.forEach((cb) => cb(true, newToken))
          resetState()
        })
        .catch(() => {
          requestingQueue.forEach((cb) => cb(false))
          resetState()
        })
    } else {
      // 不存在refreshToken直接重发请求不带token的请求即可
      requestingQueue.forEach((cb) => cb(false))
      resetState()
    }
  }

  return new Promise((resolve) => {
    requestingQueue.push((valid: boolean, token?: string) => {
      if (valid && token) {
        config.headers && (config.headers.Authorization = token)
      } else {
        config.headers && delete config.headers.Authorization
      }
      resolve(request(config))
    })
  })
}

function resetState() {
  requestingQueue.length = 0
  refreshing = false
}

// 设置历史记录
export async function setHistory(postId: number | string) {
  if (!isLogin()) return
  await history({
    post_id: postId,
    time: moment().format(DateFormat.STANDER),
  })
}
