const db = require('../../utils/db')
const snowFlake = require('../../utils/SnowFlake')
const mysql = require('mysql')

async function lists(ctx) {
  const param = ctx.request.query
  const order = param['sort'] == '+id' ? 'ASC' : 'DESC'
  const page = Number(param['page'])
  const limit = Number(param['limit'])
  const start = (page - 1) * limit
  const content = `%${param['content'] || ''}%`
  const total = await db.count('tb_user_reply')
  const sql = `SELECT ur.*, user.username as user_name, user1.username as passive_user_name, com.content as comment_content
    FROM tb_user_reply as ur
    JOIN tb_user as user ON ur.user_id=user.id
    JOIN tb_comment as com ON ur.comment_id=com.id
    JOIN tb_user as user1 ON ur.passive_user_id=user1.id
    WHERE ur.content LIKE ?
    ORDER BY id ${order} LIMIT ?, ?`
  // 获取语句异常，并返回错误的信息
  const data = await db.select(sql, [content, start, limit])
  return (ctx.body = {
    total: total,
    items: data,
  })
}

async function create(ctx) {
  const param = ctx.request.query
  param['id'] = String(snowFlake.nextId())
  await db.insert('tb_user_reply', param)
}

async function update(ctx) {
  const param = ctx.request.query
  const id = param['id']
  await db.update('tb_user_reply', param, `id=${mysql.escape(id)}`, true)
}

async function deleteMethod(ctx) {
  const param = ctx.request.query
  const id = param['id']
  await db.delete('tb_user_reply', `id=${mysql.escape(id)}`)
}

module.exports = {
  lists,
  create,
  update,
  deleteMethod,
}
