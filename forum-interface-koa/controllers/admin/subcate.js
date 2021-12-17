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
  const total = await db.count('tb_sub_cate')
  const sql = `SELECT sub.id, sub.main_id, sub.name, sub.time, sub.desc, sub.status, sub.admin_id, main.name as main_name, ad.username as admin_name
    FROM tb_sub_cate as sub
    JOIN tb_main_cate as main ON sub.main_id = main.id
    JOIN tb_admin as ad ON sub.admin_id = sub.admin_id
    WHERE sub.name LIKE ?
    ORDER BY id ${order} LIMIT ?, ?`
  // 获取语句异常，并返回错误的信息
  const data = await db.select(sql, [name, start, limit])
  return (ctx.body = {
    total: total,
    items: data,
  })
}

async function mainCate(ctx) {
  const mainCate = await db.select(`SELECT id, name FROM tb_main_cate`)
  return (ctx.body = mainCate)
}

async function create(ctx) {
  const param = ctx.request.query
  param['id'] = String(snowFlake.nextId())
  await db.insert('tb_sub_cate', param)
}

async function update(ctx) {
  const param = ctx.request.query
  let id = param['id']
  await db.update('tb_sub_cate', param, `id=${mysql.escape(id)}`, true)
}

async function deleteMethod(ctx) {
  const param = ctx.request.query
  let id = param['id']
  await db.delete('tb_sub_cate', `id=${mysql.escape(id)}`)
}

async function updateStatus(ctx) {
  const param = ctx.request.query
  let id = param['id']
  await db.update('tb_sub_cate', param, `id=${mysql.escape(id)}`)
}

module.exports = {
  lists,
  mainCate,
  create,
  update,
  deleteMethod,
  updateStatus,
}
