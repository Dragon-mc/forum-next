const db = require('../../utils/db')

async function fetchSearchPost(ctx) {
  const param = ctx.request.query
  const limit = Number(param['limit'])
  const page = Number(param['page'])
  const start = (page - 1) * limit
  const keywords = `%${param['keywords']}%`
  const allPromise = []
  const total = await db.count('tb_post', `title LIKE ? AND status=1`, [keywords])
  const sql = `SELECT user.nickname, user.username, user.avatar,
    post.id, post.user_id, post.title, post.plain, post.time, post.sub_id, post.status, post.type
    FROM tb_post as post
    JOIN tb_user as user ON post.user_id=user.id
    WHERE post.title LIKE ? AND post.status=1
    LIMIT ?, ?`
  const res = await db.select(sql, [keywords, start, limit])
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
  return (ctx.body = { total: Number(total), items: res })
}

module.exports = {
  fetchSearchPost,
}
