const db = require('../../utils/db')
const { md5 } = require('../../utils')
const Upload = require('../../utils/upload')
const os = require('os')
const stateCode = require('../../config/stateCode.config')
const { FailedError, UnauthorizedError } = require('../../utils/Error')

async function login(ctx) {
  const param = ctx.request.body
  // {"code":20000,"data":{"token":"admin-token"}}
  const pwd = md5(param['password'])
  const res = await db.find(
    `SELECT * FROM tb_admin WHERE binary username = ? AND binary password = ?`,
    [param['username'], pwd]
  )
  if (!res) {
    ctx.throwError(FailedError('登录失败，账号或密码错误'))
  }
  // 生成随机的token值
  const token = `token_${Date.now()}${Math.random()
    .toString()
    .replace(/\./g, '')}`
  const role = Number(res['level']) == 0 ? 'admin' : 'low-admin'
  // 将用户信息存到 session的token键中
  ctx.session[token] = {
    roles: [role],
    introduction: res['introduction'],
    avatar: res['avatar'],
    name: res['username'],
    admin_id: res['id'],
  }
  return (ctx.body = { token })
}

async function info(ctx) {
  const param = ctx.request.query
  // {"code":20000,"data":{"roles":["admin"],"introduction":"I am a super administrator","avatar":"https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif","name":"Super Admin"}}
  if (!!ctx.session[param['token']]) {
    return (ctx.body = ctx.session[param['token']])
  } else {
    // returnData = {
    //   'code': 20000,
    //   'data': {
    //     'roles': ['admin'],
    //     'introduction': 'I am a super administrator',
    //     'avatar': 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    //     'name': 'Super Admin111',
    //     'admin_id': 1
    //   }
    // }
    ctx.throwError(new UnauthorizedError('登录已过期，请重新登录！'))
  }
}

async function logout(ctx) {
  const param = ctx.request.body
  // 释放掉SESSION 中 存储的用户信息
  delete ctx.session[param['token']]
}

async function fetchIndexInfo(ctx) {
  const res = { statistics: {}, system: {} }
  res['statistics']['user_num'] = await db.count('tb_user')
  res['statistics']['post_num'] = await db.count('tb_post')
  res['statistics']['comment_num'] = await db.count('tb_comment')
  res['statistics']['feedback_num'] = await db.count('tb_feedback')
  res['system']['environment'] = os.type()
  res['system']['webServer'] = 'Nodejs ' + process.version
  res['system']['mysqlVersion'] =
    'MYSQL ' + (await db.find('select version() as v')).v
  res['system']['languageVersion'] = 'Nodejs ' + process.version
  res['system']['language'] = 'Nodejs'

  return (ctx.body = res)
}

async function uploadAvatar(ctx) {
  const param = ctx.request.body
  const FILE = ctx.request.files
  const admin_id = param['admin_id']
  const avatar = param['avatar'] //.replace(/_/g, '.')
  // 将头像上传至服务器
  const upload = new Upload()
  const uploadInfo = await upload.multiUpload(FILE)
  // 如果头像上传成功，则为用户设置头像
  if (uploadInfo['code'] == stateCode.SUCCESS) {
    try {
      await db.update(
        'tb_admin',
        { avatar: uploadInfo['data']['url'] },
        `id=${admin_id}`
      )
    } catch (e) {
      // 如果修改用户头像失败，则将上传的图片删除
      upload.deletePhoto(uploadInfo['data']['url'])
      ctx.throwError(new FailedError('修改头像失败'))
    }
  }
  // 删除原来的头像
  upload.deletePhoto(avatar)

  if (uploadInfo && uploadInfo.data) {
    return (ctx.body = uploadInfo.data)
  }
  ctx.throwError(new FailedError(uploadInfo && uploadInfo.message))
}

async function setSessionAvatar(ctx) {
  const param = ctx.request.body
  const avatar = param['avatar'] //.replace(/_/g, '.')
  const info = ctx.session[param['token']]
  info['avatar'] = avatar
  ctx.session[param['token']] = info
}

module.exports = {
  login,
  info,
  logout,
  fetchIndexInfo,
  uploadAvatar,
  setSessionAvatar,
}
