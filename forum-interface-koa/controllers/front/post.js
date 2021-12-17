const db = require('../../utils/db')
const Upload = require('../../utils/upload')
const mysql = require('mysql')
const snowFlake = require('../../utils/SnowFlake')
const { FailedError } = require('../../utils/Error')

async function fetchPostInfo(ctx) {
  const param = ctx.request.query
  // 帖子id
  const id = param['id']
  // 参观者id，即当前访问的用户
  const visit_id = ctx.verify.id
  let res, sql
  sql = `SELECT post.*, sc.name as cate_name
    FROM tb_post as post
    JOIN tb_sub_cate as sc ON post.sub_id=sc.id
    WHERE post.id = ?`
  res = await db.find(sql, [id])
  res['comment_times'] = await db.count('tb_comment', `post_id = ?`, [
    res['id'],
  ])
  res['read_times'] = await db.count('tb_history', `post_id = ?`, [res['id']])
  res['collection_times'] = await db.count('tb_collection', `post_id = ?`, [
    res['id'],
  ])
  res['is_collection'] = (await db.count(
    'tb_collection',
    `post_id = ? AND user_id = ?`,
    [res['id'], visit_id]
  ))
    ? true
    : false
  res['user_info'] = await db.find(`SELECT * FROM tb_user WHERE id = ?`, [
    res['user_id'],
  ])
  res['user_info']['attention_num'] = (
    await db.find(
      `SELECT count(*) as NUM FROM tb_user_relation WHERE active_id = ?`,
      [res['user_id']]
    )
  )['NUM']
  res['user_info']['fans_num'] = (
    await db.find(
      `SELECT count(*) as NUM FROM tb_user_relation WHERE passive_id = ?`,
      [res['user_id']]
    )
  )['NUM']
  res['user_info']['comment_num'] = (
    await db.find(`SELECT count(*) as NUM FROM tb_comment WHERE user_id = ?`, [
      res['user_id'],
    ])
  )['NUM']
  res['user_info']['collection_num'] = (
    await db.find(
      `SELECT count(*) as NUM FROM tb_collection WHERE user_id = ?`,
      [res['user_id']]
    )
  )['NUM']
  res['user_info']['is_attention'] = (
    await db.find(
      `SELECT count(*) as NUM FROM tb_user_relation WHERE active_id = ? AND passive_id = ?`,
      [visit_id, res['user_id']]
    )
  )['NUM']
    ? true
    : false
  res['user_info']['self'] = visit_id == res['user_info'].id
  delete res['user_info']['password']

  return (ctx.body = res)
}

async function fetchEditPostInfo(ctx) {
  ctx.forceVerify()
  const param = ctx.request.query
  const uid = ctx.verify.id
  const res = await db.find(
    `SELECT post.id, post.user_id, post.title, post.content, post.time, post.sub_id, post.status, post.type
      FROM tb_post as post WHERE id = ?`,
    [param['post_id']]
  )
  if (res.user_id !== uid) {
    // 不是自己的帖子
    return (ctx.body = {
      success: false,
      create: true,
    })
  }
  return (ctx.body = {
    success: true,
    post: res,
  })
}

async function fetchCommentInfo(ctx) {
  const param = ctx.request.query
  const post_id = param['post_id']
  const limit = Number(param['limit'])
  const page = Number(param['page'])
  const skip = (page - 1) * limit
  let total,
    sql,
    comment_info,
    allPromise = []
  total = await db.count('tb_comment', `post_id = ?`, [post_id])
  sql = `SELECT com.*, us.nickname, us.username, us.avatar
    FROM tb_comment as com
    JOIN tb_user as us ON com.user_id=us.id
    WHERE com.post_id = ?
    ORDER BY com.time DESC
    LIMIT ?, ?`
  comment_info = await db.select(sql, [post_id, skip, limit])
  for (let key in comment_info) {
    let val = comment_info[key]
    sql = `SELECT ur.*, us1.nickname, us1.username, us1.avatar, us2.nickname as passive_nickname, us2.username as passive_username
      FROM tb_user_reply as ur
      JOIN tb_user as us1 ON ur.user_id=us1.id
      JOIN tb_user as us2 ON ur.passive_user_id=us2.id
      WHERE ur.comment_id = ?
      ORDER BY ur.time ASC`
    allPromise.push(
      db.select(sql, [val['id']]).then((data) => {
        comment_info[key]['reply_info'] = data
      })
    )
  }
  await Promise.all(allPromise)

  return (ctx.body = { total: total, items: comment_info })
}

async function comment(ctx) {
  ctx.forceVerify()
  const param = ctx.request.query
  const uid = ctx.verify.id
  param['user_id'] = uid
  param['id'] = String(snowFlake.nextId())
  await db.insert('tb_comment', param, true)
}

async function reply(ctx) {
  ctx.forceVerify()
  const param = ctx.request.query
  const uid = ctx.verify.id
  param['user_id'] = uid
  param['id'] = String(snowFlake.nextId())
  await db.insert('tb_user_reply', param, true)
}

async function deletePost(ctx) {
  ctx.forceVerify()
  const param = ctx.request.query
  const uid = ctx.verify.id
  const post_id = param['post_id']
  const test = await db.find(
    `SELECT * FROM tb_post WHERE id = ? AND user_id = ?`,
    [post_id, uid]
  )
  if (!test) {
    // 操作的不是自己的帖子
    ctx.throwError(new FailedError('无操作权限'))
  }
  await db.update('tb_post', { status: 2 }, `id=${mysql.escape(post_id)}`)
}

async function uploadImg(ctx) {
  ctx.forceVerify()
  const FILE = ctx.request.files
  let uploadInfo
  let upload = new Upload()
  uploadInfo = await upload.multiUpload(FILE)
  if (uploadInfo && uploadInfo.data) {
    return (ctx.body = uploadInfo.data)
  }
  ctx.throwError(new FailedError(uploadInfo && uploadInfo.message))
}

async function postPublish(ctx) {
  ctx.forceVerify()
  const param = ctx.request.body
  const uid = ctx.verify.id
  param['user_id'] = uid
  param['id'] = String(snowFlake.nextId())
  await db.insert('tb_post', param, true)
  return (ctx.body = { post_id: param['id'] })
}

async function postEdit(ctx) {
  ctx.forceVerify()
  const param = ctx.request.body
  const uid = ctx.verify.id
  const post_id = param['id']
  const test = await db.find(
    `SELECT * FROM tb_post WHERE id = ? AND user_id = ?`,
    [post_id, uid]
  )
  if (!test) {
    ctx.throwError(new FailedError('无操作权限'))
  }
  await db.update('tb_post', param, `id=${mysql.escape(post_id)}`, true)
}

module.exports = {
  fetchPostInfo,
  fetchEditPostInfo,
  fetchCommentInfo,
  comment,
  reply,
  deletePost,
  uploadImg,
  postPublish,
  postEdit,
}
