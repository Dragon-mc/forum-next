/**
 * 请求返回状态码
 */
export enum StateCode {
  // 成功
  SUCCESS = 20000,
  // 失败
  FAILTED = 50000,
  // 参数错误
  VALIDATE_FAILED = 4004,
  // 未授权
  UNAUTHORIZED = 4001,
  // 禁止访问
  FORBIDDEN = 4003
}