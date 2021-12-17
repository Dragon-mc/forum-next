import axios, { AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import { getToken, refreshToken, delToken, logout } from './auth'
import { StateCode } from '@/enum/code'
import { bus } from './'

// 创建axios实例
const axiosConfig: AxiosRequestConfig = {
  withCredentials: true,
  timeout: 5000, // request timeout
}
if (!import.meta.env.DEV) {
  // 非开发环境，配置baseURL；开发环境走本地代理请求
  axiosConfig.baseURL = import.meta.env.VITE_BASE_URL
}
const http = axios.create(axiosConfig)

// 请求前的拦截器
http.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 请求前可对配置信息进行操作
    const token = getToken()
    if (token) {
      config.headers && (config.headers.Authorization = `Bearer ${token}`)
    }
    return config
  },
  error => {
    // 发生错误后，返回错误信息
    return Promise.reject(error)
  }
)

// 收到请求后提前对数据拦截，执行检测操作
http.interceptors.response.use(
  response => {
    const res = response.data

    // 前后端约定，信息正确的状态码返回20000，不正确则弹出错误信息
    if (res.code !== StateCode.SUCCESS) {
      if (res.code === StateCode.FORBIDDEN) {
        // 认证失败或无法刷新token，删除登录信息
        logout()
        bus.emit('user-info-update')
        return Promise.reject()
      } else if (res.code === StateCode.UNAUTHORIZED) {
        delToken()
        // token过期，尝试刷新token
        return refreshToken(response.config)
      }
      ElMessage({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || 'Error'))
    }
    return res
  },
  error => {
    ElMessage({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default http
