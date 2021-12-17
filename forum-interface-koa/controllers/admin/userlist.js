const db = require('../../utils/db')
const snowFlake = require('../../utils/SnowFlake')
const mysql = require('mysql')

async function lists(ctx) {
  const param = ctx.request.query
  const order = param['sort'] == '+id' ? 'ASC' : 'DESC'
  const page = Number(param['page'])
  const limit = Number(param['limit'])
  const start = (page - 1) * limit
  const username = `%${param['username'] || ''}%`
  const nickname = `%${param['nickname'] || ''}%`
  const where = typeof param['sex'] !== 'undefined' ? `AND sex=${mysql.escape(param['sex'])}` : ''
  const total = await db.count('tb_user')
  const sql = `SELECT id, username, nickname, sex, sign, introduction, create_time, last_time
    FROM tb_user
    WHERE username LIKE ? AND nickname LIKE ? ${where}
    ORDER BY id ${order} LIMIT ?, ?`
  // 获取语句异常，并返回错误的信息
  const data = await db.select(sql, [username, nickname, start, limit])
  return (ctx.body = {
    total: total,
    items: data,
  })
}

async function create(ctx) {
  const param = ctx.request.query
  param['id'] = String(snowFlake.nextId())
  await db.insert('tb_user', param)
}

async function update(ctx) {
  const param = ctx.request.query
  const id = param['id']
  await db.update('tb_user', param, `id=${mysql.escape(id)}`, true)
}

async function deleteMethod(ctx) {
  const param = ctx.request.query
  const id = param['id']
  await db.delete('tb_user', `id=${mysql.escape(id)}`)
}

module.exports = {
  lists,
  create,
  update,
  deleteMethod,
}
