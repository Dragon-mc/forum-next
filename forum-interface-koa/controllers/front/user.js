const db = require('../../utils/db')
const { md5, getNowDate } = require('../../utils')
const mysql = require('mysql')
const snowFlake = require('../../utils/SnowFlake')
const { getVcode } = require('../../utils')
const { FailedError, ForbiddenError } = require('../../utils/Error')

function getVerifyCode(ctx) {
  const param = ctx.request.body
  const token = param['token']
  ctx.body = getVcode(token, ctx)
}

async function register(ctx) {
  const param = ctx.request.body
  // 获取SESSION中存储的验证码值
  let vcode = ctx.session[param['token']]
  if (vcode.toLowerCase() != param['vcode'].toLowerCase()) {
    // '验证码错误!'
    ctx.throwError(new FailedError('验证码错误！'))
  }

  // 将账号密码存入数据库 对密码进行md5加密
  param['password'] = md5(param['password'])
  // 生成唯一递增id
  param['id'] = String(snowFlake.nextId())

  // 各项验证通过，将数据插入数据库
  await db.insert('tb_user', param, true)
}

async function login(ctx) {
  const param = ctx.request.body
  // 获取SESSION中存储的验证码值
  const vcode = ctx.session[param['token']]
  if (!vcode || vcode.toLowerCase() != param['vcode'].toLowerCase()) {
    ctx.throwError(new FailedError('验证码错误！'))
  }
  // 检验账号密码是否正确
  const pwd = md5(param['password'])
  const res = await db.find(
    `SELECT * FROM tb_user WHERE binary username = ? AND binary password = ?`,
    [param['username'], pwd]
  )

  if (res) {
    delete res['password']
    let formatDate = getNowDate()
    await db.update(
      'tb_user',
      { last_time: formatDate },
      `id=${mysql.escape(res['id'])}`
    )
    return (ctx.body = {
      info: res,
      token: ctx.jwt.createToken({ uid: res.id }),
      refresh_token: ctx.jwt.createToken({ id: res.id }, true),
    })
  } else {
    ctx.throwError(new FailedError('账号密码有误！'))
  }
}

async function refreshToken(ctx) {
  const { token } = ctx.request.body
  const res = ctx.jwt.tokenVerify(token)
  if (!res.pass) {
    ctx.throwError(new ForbiddenError(''))
  }
  return (ctx.body = ctx.jwt.createToken({ uid: res.data.id }))
}

async function getUserInfo(ctx) {
  ctx.forceVerify()
  // if (!ctx.forceVerify()) return
  const uid = ctx.verify.id
  const res = await db.find(`SELECT * FROM tb_user WHERE id = ?`, [uid])
  delete res['password']
  ctx.body = res
}

async function checkUserExist(ctx) {
  const param = ctx.request.query
  const username = param['username']
  const res = await db.count('tb_user', `binary username = ?`, [username])
  if (res == 0) {
    return (ctx.body = false)
  } else {
    return (ctx.body = true)
  }
}

async function cancelAttention(ctx) {
  ctx.forceVerify()
  const param = ctx.request.query
  const uid = ctx.verify.id
  param['active_id'] = uid
  try {
    await db.delete('tb_user_relation', `active_id = ? AND passive_id = ?`, [
      param['active_id'],
      param['passive_id'],
    ])
  } catch (e) {
    ctx.throwError(new FailedError('取消关注失败'))
  }
}

async function attention(ctx) {
  ctx.forceVerify()
  const param = ctx.request.query
  const uid = ctx.verify.id
  param['active_id'] = uid
  param['id'] = String(snowFlake.nextId())
  try {
    await db.insert('tb_user_relation', param, true)
  } catch (e) {
    ctx.throwError(new FailedError('关注失败'))
  }
}

async function calcelCollection(ctx) {
  ctx.forceVerify()
  const param = ctx.request.query
  const uid = ctx.verify.id
  try {
    await db.delete('tb_collection', `post_id = ? AND user_id = ?`, [
      param['post_id'],
      uid,
    ])
  } catch (e) {
    ctx.throwError(new FailedError('取消收藏失败'))
  }
}

async function collection(ctx) {
  ctx.forceVerify()
  const param = ctx.request.query
  const uid = ctx.verify.id
  param['user_id'] = uid
  param['id'] = String(snowFlake.nextId())
  try {
    await db.insert('tb_collection', param, true)
  } catch (e) {
    ctx.throwError(new FailedError('收藏失败'))
  }
}

async function history(ctx) {
  ctx.forceVerify()
  const param = ctx.request.query
  const uid = ctx.verify.id
  param['user_id'] = uid
  param['id'] = String(snowFlake.nextId())
  const res = await db.find(
    `SELECT id FROM tb_history WHERE user_id = ? AND post_id = ?`,
    [param['user_id'], param['post_id']]
  )
  if (res) {
    // 如果记录存在
    await db.update(
      'tb_history',
      { time: param['time'] },
      `id=${mysql.escape(res['id'])}`
    )
  } else {
    // 记录不存在
    await db.insert('tb_history', param, true)
  }
}

async function feedback(ctx) {
  ctx.forceVerify()
  const param = ctx.request.query
  const uid = ctx.verify.id
  param['user_id'] = uid
  param['id'] = String(snowFlake.nextId())
  await db.insert('tb_feedback', param, true)
}

async function modifyPassword(ctx) {
  ctx.forceVerify()
  const param = ctx.request.body
  const uid = ctx.verify.id
  param['user_id'] = uid
  const res = await db.find(
    `SELECT * FROM tb_user WHERE id = ? AND binary password = ?`,
    [param['user_id'], md5(param['password'])]
  )
  if (res) {
    await db.update(
      'tb_user',
      { password: md5(param['newPassword']) },
      `id=${mysql.escape(param['user_id'])}`
    )
    return (ctx.body = {
      success: true,
      message: '修改密码成功！',
    })
  } else {
    return (ctx.body = {
      success: false,
      message: '原密码错误！',
    })
  }
}

module.exports = {
  getVerifyCode,
  register,
  login,
  refreshToken,
  getUserInfo,
  checkUserExist,
  cancelAttention,
  attention,
  calcelCollection,
  collection,
  history,
  feedback,
  modifyPassword,
}
