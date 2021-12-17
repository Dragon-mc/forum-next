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
  const has_reply = param['has_reply']
  let sql = `SELECT fb.*, user.username
    FROM tb_feedback as fb
    JOIN tb_user as user ON fb.user_id=user.id
    WHERE fb.content LIKE ?
    ORDER BY id ${order} LIMIT ?, ?`
  // 获取语句异常，并返回错误的信息
  const allPromise = []
  const data = await db.select(sql, [content, start, limit])
  // 遍历查询结果，查找出反馈的所有回复
  sql = `SELECT ar.*, admin.username as admin_name
    FROM tb_admin_reply as ar
    JOIN tb_admin as admin ON ar.admin_id=admin.id
    WHERE feedback_id = ?`
  for (let key in data) {
    let val = data[key]
    allPromise.push(
      db.select(sql, [val['id']]).then((res) => {
        data[key]['reply_data'] = res
        data[key]['reply_times'] = res.length
      })
    )
  }
  // 等待所有并发执行的查询完成
  await Promise.all(allPromise)
  // 如果存在回复条件筛选，则遍历将不满足条件的内容删除
  if (!!has_reply)
    for (let i = data.length - 1; i >= 0; i--) {
      if (has_reply == '已回复') {
        if (data[i]['reply_times'] <= 0) {
          data.splice(i, 1)
        }
      } else if (has_reply == '未回复') {
        if (data[i]['reply_times'] > 0) {
          data.splice(i, 1)
        }
      }
    }
  return (ctx.body = {
    total: data.length,
    items: data,
  })
}

async function replyUser(ctx) {
  const param = ctx.request.query
  param['id'] = String(snowFlake.nextId())
  await db.insert('tb_admin_reply', param)
}

async function deleteMethod(ctx) {
  const param = ctx.request.query
  const id = param['id']
  await db.delete('tb_feedback', `id=${mysql.escape(id)}`)
}

module.exports = {
  lists,
  replyUser,
  deleteMethod,
}
