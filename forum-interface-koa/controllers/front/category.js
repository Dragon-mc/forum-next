const db = require('../../utils/db')

async function fetchPost(ctx) {
  const param = ctx.request.query
  let limit = Number(param['limit'])
  let skip = Number(param['skip'])
  let res,
    sql,
    cate_info = []
  const allPromise = []
  if (param['main_cate']) {
    // 处理获取主分类中所有帖子
    sql = `SELECT user.nickname, user.username, user.avatar,
      post.id, post.user_id, post.title, post.plain, post.time, post.sub_id, post.status, post.type
      FROM tb_post as post
      JOIN tb_user as user ON post.user_id=user.id
      JOIN tb_sub_cate as sub ON post.sub_id=sub.id
      WHERE sub.main_id = ? AND post.status=1
      LIMIT ?, ?`
    res = await db.select(sql, [param['main_cate'], skip, limit])
    cate_info = await db.find(
      `SELECT name, desc FROM tb_main_cate WHERE id = ?`,
      [param['main_cate']]
    )
  } else if (param['sub_cate']) {
    // 处理获取次分类中所有帖子
    sql = `SELECT user.nickname, user.username, user.avatar,
      post.id, post.user_id, post.title, post.plain, post.time, post.sub_id, post.status, post.type
      FROM tb_post as post
      JOIN tb_user as user ON post.user_id=user.id
      WHERE post.sub_id = ? AND post.status=1
      LIMIT ?, ?`
    res = await db.select(sql, [param['sub_cate'], skip, limit])
    cate_info = await db.find(
      `SELECT name, desc FROM tb_sub_cate WHERE id = ?`,
      [param['sub_cate']]
    )
  } else {
    // 当没有指定分类时
    sql = `SELECT user.nickname, user.username, user.avatar,
      post.id, post.user_id, post.title, post.plain, post.time, post.sub_id, post.status, post.type
      FROM tb_post as post
      JOIN tb_user as user ON post.user_id=user.id
      WHERE post.status=1
      LIMIT ?, ?`
    res = await db.select(sql, [skip, limit])
  }

  for (let key in res) {
    let val = res[key]
    // 获取到每一个帖子的被评论次数
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
  return (ctx.body = { post: res, cate: cate_info })
}

async function fetchCategory(ctx) {
  const allPromise = []
  const res = await db.select('SELECT `id`, `name` FROM `tb_main_cate`')
  for (let key in res) {
    let val = res[key]
    allPromise.push(
      db
        .select(`SELECT id, name FROM tb_sub_cate WHERE main_id = ?`, [
          val['id'],
        ])
        .then((data) => {
          res[key]['sub_cate'] = data
        })
    )
  }
  await Promise.all(allPromise)
  return (ctx.body = res)
}

module.exports = {
  fetchPost,
  fetchCategory,
}
