const db = require('../../utils/db')
const snowFlake = require('../../utils/SnowFlake')
const mysql = require('mysql')

async function lists(ctx) {
  const param = ctx.request.query
  const order = param['sort'] == '+id' ? 'ASC' : 'DESC'
  const page = Number(param['page'])
  const limit = Number(param['limit'])
  const start = (page - 1) * limit
  const title = `%${param['title'] || ''}%`
  const content = `%${param['content'] || ''}%`
  const total = await db.count('tb_comment')
  const sql = `SELECT com.*, user.username as user_name, post.title as post_name
    FROM tb_comment as com
    JOIN tb_user as user ON com.user_id=user.id
    JOIN tb_post as post ON com.post_id=post.id
    WHERE post.title LIKE ? AND com.content LIKE ?
    ORDER BY id ${order} LIMIT ?, ?`
  // 获取语句异常，并返回错误的信息
  const data = await db.select(sql, [title, content, start, limit])
  return (ctx.body = {
    total: total,
    items: data,
  })
}

async function create(ctx) {
  const param = ctx.request.query
  param['id'] = String(snowFlake.nextId())
  await db.insert('tb_post', param)
}

async function update(ctx) {
  const param = ctx.request.query
  const id = param['id']
  await db.update('tb_post', param, `id=${mysql.escape(id)}`, true)
}

async function deleteMethod(ctx) {
  const param = ctx.request.query
  const id = param['id']
  await db.delete('tb_post', `id=${mysql.escape(id)}`)
}

module.exports = {
  lists,
  create,
  update,
  deleteMethod,
}
