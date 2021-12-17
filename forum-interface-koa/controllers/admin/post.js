const db = require('../../utils/db')
const snowFlake = require('../../utils/SnowFlake')
const mysql = require('mysql')

async function lists(ctx) {
  const param = ctx.request.query
  const order = param['sort'] == '+id' ? 'ASC' : 'DESC'
  const page = Number(param['page'])
  const limit = Number(param['limit'])
  const start = (page - 1) * limit
  const where = typeof param['sub_id'] !== 'undefined' ? `AND post.sub_id=${mysql.escape(param['sub_id'])}` : ''
  const title = `%${param['title'] || ''}%`
  const content = `%${param['content'] || ''}%`
  const total = await db.count('tb_post')
  const sql = `SELECT post.*, SUBSTR(post.content, 1, 100) as content, user.username as user_name, sub.name as sub_name
    FROM tb_post as post
    JOIN tb_sub_cate as sub ON post.sub_id=sub.id
    JOIN tb_user as user ON post.user_id=user.id
    WHERE post.status < 2 AND post.title LIKE ? AND post.content LIKE ? ${where}
    ORDER BY id ${order} LIMIT ?, ?`
  // 获取语句异常，并返回错误的信息
  const data = await db.select(sql, [title, content, start, limit])
  return (ctx.body = {
    total: total,
    items: data,
  })
}

async function subCate(ctx) {
  const mainCate = await db.select(`SELECT id, name FROM tb_sub_cate`)
  return (ctx.body = mainCate)
}

async function create(ctx) {
  const param = ctx.request.body
  param['id'] = String(snowFlake.nextId())
  await db.insert('tb_post', param)
}

async function update(ctx) {
  const param = ctx.request.body
  const id = param['id']
  await db.update('tb_post', param, `id=${mysql.escape(id)}`, true)
}

async function deleteMethod(ctx) {
  const param = ctx.request.query
  const post_id = param['id']
  await db.update('tb_post', { status: 2 }, `id=${mysql.escape(post_id)}`)
}

async function updateStatus(ctx) {
  const param = ctx.request.query
  const id = param['id']
  await db.update('tb_post', param, `id=${mysql.escape(id)}`)
}

module.exports = {
  lists,
  subCate,
  create,
  update,
  deleteMethod,
  updateStatus,
}
