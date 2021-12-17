import request from '@/utils/request'
import type { requestVerifyCode, requestUserExist } from '@/types/request/register'

// 获取验证码图片
export function getVerifyCode (data: requestVerifyCode) {
  return request({
    url: '/front/user/get_verify_code',
    method: 'post',
    data
  })
}

export function checkUserExist (data: requestUserExist) {
  return request({
    url: '/front/user/check_user_exist',
    method: 'get',
    params: data
  })
}
