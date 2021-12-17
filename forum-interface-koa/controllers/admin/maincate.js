const db = require('../../utils/db')
const snowFlake = require('../../utils/SnowFlake')
const mysql = require('mysql')

async function lists(ctx) {
  const param = ctx.request.query
  const order = param['sort'] == '+id' ? 'ASC' : 'DESC'
  const page = Number(param['page'])
  const limit = Number(param['limit'])
  const start = (page - 1) * limit
  const name = `%${param['name'] || ''}%`
  const total = await db.count('tb_main_cate')
  const sql = `SELECT main.id, main.name, main.time, main.admin_id, main.desc, main.status, ad.username as admin_name
    FROM tb_main_cate as main
    JOIN tb_admin as ad ON main.admin_id=ad.id
    WHERE name LIKE ?
    ORDER BY id ${order} LIMIT ?, ?`

  // 获取语句异常，并返回错误的信息
  const data = await db.select(sql, [name, start, limit])
  return (ctx.body = {
    total: total,
    items: data,
  })
}

async function create(ctx) {
  const param = ctx.request.query
  param['id'] = String(snowFlake.nextId())
  await db.insert('tb_main_cate', param)
}

async function update(ctx) {
  const param = ctx.request.query
  const id = param['id']
  await db.update('tb_main_cate', param, `id=${mysql.escape(id)}`, true)
}

async function deleteMethod(ctx) {
  const param = ctx.request.query
  const id = param['id']
  await db.delete('tb_main_cate', `id=${mysql.escape(id)}`)
}

async function updateStatus(ctx) {
  const param = ctx.request.query
  const id = param['id']
  await db.update('tb_main_cate', param, `id=${mysql.escape(id)}`)
}

module.exports = {
  lists,
  create,
  update,
  deleteMethod,
  updateStatus,
}
