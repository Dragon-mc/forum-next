const db = require('../../utils/db')
const mysql = require('mysql')
const Oauth = require('../../utils/oauth')
const snowFlake = require('../../utils/SnowFlake')
const { getNowDate } = require('../../utils')
const { FailedError } = require('../../utils/Error')

async function login(ctx) {
  const { code, type } = ctx.request.body
  const oauth = new Oauth(code, type)
  // 获取access_token
  const tokenRes = await oauth.getToken()
  if (!tokenRes.success) {
    ctx.throwError(new FailedError('认证失败'))
  }

  // 认证成功，利用token获取用户信息
  const { success, info: thirdPartyInfo } = await oauth.getUserInfo(
    tokenRes.token
  )
  if (!success) {
    ctx.throwError(new FailedError('用户信息获取失败'))
  }
  let id

  // 查询三方账号是否关联平台用户
  const platformUser = await db.find(
    'SELECT * FROM `tb_user_oauth` WHERE oauth_id = ?',
    [thirdPartyInfo.id]
  )
  const time = getNowDate()
  if (!platformUser) {
    // 如果没有账户，则直接在平台上组注册一个账户并关联
    const userId = String(snowFlake.nextId())
    const param = {
      id: userId,
      username: `${type}_${new Date().getTime()}`,
      password: '__empty__',
      nickname: thirdPartyInfo.name,
      avatar: thirdPartyInfo.avatar_url,
      create_time: time,
    }
    await db.insert('tb_user', param)
    // 将第三方平台关联
    await db.insert('tb_user_oauth', {
      id: String(snowFlake.nextId()),
      user_id: userId,
      oauth_id: thirdPartyInfo.id,
      type,
    })
    id = userId
  } else {
    // 已有平台账户
    id = platformUser['user_id']
  }

  // 查找用户信息
  const userInfo = await db.find('SELECT * FROM `tb_user` WHERE id = ?', [id])
  delete userInfo['password']
  await db.update(
    'tb_user',
    { last_time: getNowDate() },
    `id=${mysql.escape(id)}`
  )

  return (ctx.body = {
    info: userInfo,
    token: ctx.jwt.createToken({ uid: id }),
    refresh_token: ctx.jwt.createToken({ id: id }, true),
  })
}

async function bind(ctx) {
  // 绑定前检测是否登录
  ctx.forceVerify()
  const uid = ctx.verify.id
  const { code, type } = ctx.request.body
  const userBind = await db.find(
    'SELECT * FROM `tb_user_oauth` WHERE user_id = ? AND type = ?',
    [uid, type]
  )
  if (userBind) {
    // 用户已绑定此三方平台
    ctx.throwError(new FailedError('此三方平台已绑定'))
  }

  const oauth = new Oauth(code, type)
  // 获取access_token
  const tokenRes = await oauth.getToken(true)
  if (!tokenRes.success) {
    ctx.throwError(new FailedError('认证失败'))
  }

  // 认证成功，利用token获取用户信息
  const { success, info: thirdPartyInfo } = await oauth.getUserInfo(
    tokenRes.token
  )
  if (!success) {
    ctx.throwError(new FailedError('用户信息获取失败'))
  }

  // 查看用户是否绑定
  const exist = await db.find(
    'SELECT * FROM `tb_user_oauth` WHERE oauth_id = ? AND type = ?',
    [thirdPartyInfo.id, type]
  )
  if (exist) {
    // 三方账号已绑定
    ctx.throwError(new FailedError('三方账户已被绑定'))
  }

  // 绑定当前账户
  await db.insert('tb_user_oauth', {
    id: String(snowFlake.nextId()),
    user_id: uid,
    oauth_id: thirdPartyInfo.id,
    type,
  })
}

async function unbind(ctx) {
  ctx.forceVerify()
  const uid = ctx.verify.id
  const { type } = ctx.request.body
  await db.delete('tb_user_oauth', 'user_id = ? AND type = ?', [uid, type])
}

module.exports = {
  login,
  bind,
  unbind,
}
