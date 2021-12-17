import { checkUserExist } from '@/api/register'

// 验证用户名
export const validateUsername = (rule: any, value: string, callback: Function) => {
  if (value.length < 6 || value.length > 16) {
    callback(new Error('请输入正确的用户名！'))
  } else {
    callback()
  }
}

// 验证密码
export const validatePassword = (rule: any, value: string, callback: Function) => {
  if (value.length < 8 || value.length > 20) {
    callback(new Error('密码长度最少8位，不超过20位'))
  } else {
    callback()
  }
}

// 重复密码验证
export function validateRepassword(getData: () => string) {
  return (rule: any, value: string, callback: Function) => {
    if (value !== getData()) {
      callback(new Error('两次密码不一致'))
    } else {
      callback()
    }
  }
}

// 注册时账号验证
export function validateRegisteUsername (getData: () => string) {
  return async (rule: any, value: string, callback: Function) => {
    // 发送请求，检验用户名是否存在
    let res: any
    if (!value.trim()) return
    res = await checkUserExist({ username: getData() })
    if (res.data) callback(new Error('用户名已存在！'))
    // 检测用户名是否为数字和字母
    let reg = /[A-z0-9]+/
    if (!reg.test(value)) callback(new Error('用户名只能为英文数字组合！'))
    // 检测用户名长度
    if (value.length < 6 || value.length > 16) {
      callback(new Error('请输入正确的用户名！'))
    } else {
      callback()
    }
  }
}

// 注册时密码验证
export const validateRegistePassword = (rule: any, value: string, callback: Function) => {
  let reg = /^[0-9A-z`~!@#$%^&*()_+-=\/\\\[\]\{\};':",.<>?]{8,20}$/
  if (value.length < 8 || value.length > 20) {
    callback(new Error('密码长度最少8位，不超过20位'))
  } else if (!reg.test(value)) {
    callback(new Error('密码只能使用英文、数字和特殊字符'))
  } else {
    callback()
  }
}
