const db = require('../../utils/db')
const Upload = require('../../utils/upload')
const mysql = require('mysql')
const stateCode = require('../../config/stateCode.config')
const { FailedError } = require('../../utils/Error')

async function getUserInfo(ctx) {
  const param = ctx.request.query
  const visit_id = ctx.verify.id
  const username = param['username']
  const res = await db.find(
    `SELECT id, username, nickname, sex, avatar, sign, introduction, create_time, last_time FROM tb_user WHERE username = ?`,
    [username]
  )
  const id = res['id']
  res['attention_num'] = await db.count('tb_user_relation', `active_id = ?`, [
    id,
  ])
  res['fans_num'] = await db.count('tb_user_relation', `passive_id = ?`, [id])
  res['is_attention'] = (await db.count(
    'tb_user_relation',
    `active_id = ? AND passive_id = ?`,
    [visit_id, id]
  ))
    ? true
    : false
  res['self'] = visit_id == id
  // 获取三方绑定信息
  if (res.self) {
    const thirdPartyType = await db.select(
      'SELECT type FROM `tb_user_oauth` WHERE user_id = ?',
      [visit_id]
    )
    const thirdParty = {}
    thirdPartyType.forEach((item) => (thirdParty[item.type] = true))
    res['third_party'] = thirdParty
  }

  return (ctx.body = res)
}

async function fetchCollection(ctx) {
  const param = ctx.request.query
  const visit_id = ctx.verify.id
  let id = param['id']
  let limit = Number(param['limit'])
  let page = Number(param['page'])
  let skip = (page - 1) * limit
  const allPromise = []
  const total = await db.count('tb_collection', `user_id = ?`, [id])
  const sql = `SELECT us.username, us.nickname, us.avatar, us.id as user_id, col.time as collection_time,
    post.id, post.user_id, post.title, post.plain, post.time, post.sub_id, post.status, post.type
    FROM tb_collection as col
    JOIN tb_post as post ON col.post_id=post.id
    JOIN tb_user as us ON post.user_id=us.id
    WHERE col.user_id = ?
    ORDER BY col.time DESC
    LIMIT ?, ?`
  const res = await db.select(sql, [id, skip, limit])
  for (let key in res) {
    let val = res[key]
    // 获取帖子被评论次数
    allPromise.push(
      db.count('tb_comment', `post_id = ?`, [val['id']]).then((data) => {
        res[key]['comment_times'] = data
      })
    )
    // 获取帖子被浏览次数
    allPromise.push(
      db.count('tb_history', `post_id = ?`, [val['id']]).then((data) => {
        res[key]['read_times'] = data
      })
    )
    // 查看帖子是否被当前用户收藏
    allPromise.push(
      db
        .count('tb_collection', `post_id = ? AND user_id = ?`, [
          val['id'],
          visit_id,
        ])
        .then((data) => {
          res[key]['is_collection'] = data ? true : false
        })
    )
  }
  await Promise.all(allPromise)

  return (ctx.body = { total: total, items: res })
}

async function fetchPublish(ctx) {
  const param = ctx.request.query
  const id = param['id']
  const limit = Number(param['limit'])
  const page = Number(param['page'])
  const skip = (page - 1) * limit
  const allPromise = []
  const total = await db.count('tb_post', `user_id = ? AND status=1`, [id])
  const res = await db.select(
    `SELECT id, user_id, title, plain, time, sub_id, status, type
      FROM tb_post WHERE user_id = ? AND status=1 ORDER BY time DESC LIMIT ?, ?`,
    [id, skip, limit]
  )
  for (let key in res) {
    let val = res[key]
    // 获取帖子被评论次数
    allPromise.push(
      db.count('tb_comment', `post_id = ?`, [val['id']]).then((data) => {
        res[key]['comment_times'] = data
      })
    )
    // 获取帖子被浏览次数
    allPromise.push(
      db.count('tb_history', `post_id = ?`, [val['id']]).then((data) => {
        res[key]['read_times'] = data
      })
    )
  }
  await Promise.all(allPromise)

  return (ctx.body = { total: total, items: res })
}

async function fetchDraftPost(ctx) {
  const param = ctx.request.query
  const id = param['id']
  const limit = Number(param['limit'])
  const page = Number(param['page'])
  const skip = (page - 1) * limit
  const total = await db.count('tb_post', `user_id = ? AND status = 0`, [id])
  const res = await db.select(
    `SELECT id, user_id, title, plain, time, sub_id, status, type
      FROM tb_post WHERE user_id = ? AND status=0 ORDER BY time DESC LIMIT ?, ?`,
    [id, skip, limit]
  )

  return (ctx.body = { total: total, items: res })
}

async function fetchAttention(ctx) {
  const param = ctx.request.query
  const visit_id = ctx.verify.id
  const id = param['id']
  const limit = Number(param['limit'])
  const page = Number(param['page'])
  const skip = (page - 1) * limit
  const allPromise = []
  const total = await db.count('tb_user_relation', `active_id = ?`, [id])
  const sql = `SELECT user.*
    FROM tb_user_relation as ur
    JOIN tb_user as user ON ur.passive_id=user.id
    WHERE ur.active_id = ?
    ORDER BY ur.time DESC
    LIMIT ?, ?`
  const res = await db.select(sql, [id, skip, limit])
  for (let key in res) {
    allPromise.push(
      db
        .count('tb_user_relation', `active_id = ? AND passive_id = ?`, [
          visit_id,
          res[key]['id'],
        ])
        .then((data) => {
          res[key]['is_attention'] = data ? true : false
        })
    )
    res[key]['self'] = res.id == visit_id
    delete res[key]['password']
  }
  await Promise.all(allPromise)

  return (ctx.body = { total: total, items: res })
}

async function fetchFans(ctx) {
  const param = ctx.request.query
  const visit_id = ctx.verify.id
  const id = param['id']
  const limit = Number(param['limit'])
  const page = Number(param['page'])
  const skip = (page - 1) * limit
  const allPromise = []
  const total = await db.count('tb_user_relation', `passive_id = ?`, [id])
  const sql = `SELECT user.*
    FROM tb_user_relation as ur
    JOIN tb_user as user ON ur.active_id=user.id
    WHERE ur.passive_id = ?
    ORDER BY ur.time DESC
    LIMIT ?, ?`
  const res = await db.select(sql, [id, skip, limit])
  for (let key in res) {
    let val = res[key]
    allPromise.push(
      db
        .count('tb_user_relation', `active_id = ? AND passive_id = ?`, [
          visit_id,
          val['id'],
        ])
        .then((data) => {
          res[key]['is_attention'] = data ? true : false
        })
    )
    res[key]['self'] = res.id == visit_id
    delete res[key]['password']
  }
  await Promise.all(allPromise)

  return (ctx.body = { total: total, items: res })
}

async function fetchHistory(ctx) {
  const param = ctx.request.query
  const id = param['id']
  const limit = Number(param['limit'])
  const page = Number(param['page'])
  const skip = (page - 1) * limit
  const allPromise = []
  const total = await db.count('tb_history', `user_id = ?`, [id])
  const sql = `SELECT us.username, us.nickname, us.avatar, us.id as user_id, his.time as history_time,
    post.id, post.user_id, post.title, post.plain, post.time, post.sub_id, post.status, post.type
    FROM tb_history as his
    JOIN tb_post as post ON his.post_id=post.id
    JOIN tb_user as us ON post.user_id=us.id
    WHERE his.user_id = ?
    ORDER BY his.time DESC
    LIMIT ?, ?`
  const res = await db.select(sql, [id, skip, limit])
  for (let key in res) {
    let val = res[key]
    // 获取帖子被评论次数
    allPromise.push(
      db.count('tb_comment', `post_id = ?`, [val['id']]).then((data) => {
        res[key]['comment_times'] = data
      })
    )
    // 获取帖子被浏览次数
    allPromise.push(
      db.count('tb_history', `post_id = ?`, [val['id']]).then((data) => {
        res[key]['read_times'] = data
      })
    )
  }
  await Promise.all(allPromise)

  return (ctx.body = { total: total, items: res })
}

async function modifyProfile(ctx) {
  ctx.forceVerify()
  const uid = ctx.verify.id
  const param = ctx.request.body
  await db.update('tb_user', param, `id=${mysql.escape(uid)}`, true)
}

async function uploadAvatar(ctx) {
  ctx.forceVerify()
  const FILE = ctx.request.files
  const param = ctx.request.body
  const uid = ctx.verify.id
  const user_id = uid
  const avatar = param.avatar // .replace(/_/g, '.')
  // 将头像上传至服务器
  const upload = new Upload()
  const uploadInfo = await upload.multiUpload(FILE)
  // 如果头像上传成功，则为用户设置头像
  if (uploadInfo['code'] == stateCode.SUCCESS) {
    try {
      await db.update(
        'tb_user',
        { avatar: uploadInfo['data']['url'] },
        `id=${mysql.escape(user_id)}`
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

module.exports = {
  getUserInfo,
  fetchCollection,
  fetchPublish,
  fetchDraftPost,
  fetchAttention,
  fetchFans,
  fetchHistory,
  modifyProfile,
  uploadAvatar,
}
