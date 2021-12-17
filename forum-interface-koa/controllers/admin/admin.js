const db = require('../../utils/db')
const { md5 } = require('../../utils')
const snowFlake = require('../../utils/SnowFlake')
const mysql = require('mysql')

async function lists(ctx) {
  const param = ctx.request.query
  const order = param['sort'] == '+id' ? 'ASC' : 'DESC'
  const page = Number(param['page'])
  const limit = Number(param['limit'])
  const start = (page - 1) * limit
  const username = `%${param['username'] || ''}%`
  const level = `%${param['level'] || ''}%`
  const sql = `SELECT id, username, introduction, create_time, level FROM tb_admin
    WHERE username LIKE ? AND level LIKE ? ORDER BY id ${order} LIMIT ?, ?`
  // 获取语句异常，并返回错误的信息
  const data = await db.select(sql, [username, level, start, limit])
  const total = data.length
  return (ctx.body = {
    total: total,
    items: data,
  })
}

async function create(ctx) {
  const param = ctx.request.query
  param['password'] = md5(param['password'])
  param['id'] = String(snowFlake.nextId())
  await db.insert('tb_admin', param)
}

async function update(ctx) {
  const param = ctx.request.query
  const id = param['id']
  await db.update('tb_admin', param, `id=${mysql.escape(id)}`, true)
}

async function deleteMethod(ctx) {
  const param = ctx.request.query
  const id = param['id']
  await db.delete('tb_admin', `id=${mysql.escape(id)}`)
}

module.exports = {
  lists,
  create,
  update,
  deleteMethod,
}
