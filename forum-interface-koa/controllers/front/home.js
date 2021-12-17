const db = require('../../utils/db')

async function fetchRecommendPostList(ctx) {
  const param = ctx.request.query
  const limit = Number(param['limit'])
  const skip = Number(param['skip'])
  const allPromise = []
  const sql = `SELECT user.nickname, user.username, user.avatar,
    post.id, post.user_id, post.title, post.plain, post.time, post.sub_id, post.status, post.type
    FROM tb_post as post
    JOIN tb_user as user ON post.user_id=user.id
    WHERE post.status=1
    ORDER BY post.time DESC
    LIMIT ?, ?`
  const res = await db.select(sql, [skip, limit])
  for (let key in res) {
    // 获取帖子被评论次数
    // 并发执行所有获取操作
    allPromise.push(
      db.count('tb_comment', `post_id = ?`, [res[key]['id']]).then((data) => {
        res[key]['comment_times'] = data
      })
    )
    // 获取帖子被浏览次数
    allPromise.push(
      db.count('tb_history', `post_id = ?`, [res[key]['id']]).then((data) => {
        res[key]['read_times'] = data
      })
    )
  }
  // 等待所有数据获取操作完成后，才执行下一步
  await Promise.all(allPromise)
  ctx.body = res
}

const srcReg = /\bsrc\b\s*=\s*[\'\"]?([^\'\"]*)[\'\"]?/i
async function fetchCarouselList(ctx) {
  // 随机抽取5个拥有图片数据的帖子
  const sql = `SELECT tb_user.username,
    post.id, post.user_id, post.title, post.content, post.time, post.sub_id, post.status, post.type
    FROM tb_post as post
    JOIN tb_user ON post.user_id=tb_user.id 
    WHERE content LIKE '%<img%src=%>' ORDER BY rand() LIMIT 5`
  const res = await db.select(sql)
  // 匹配出图片
  res.forEach((val) => {
    const content = val.content
    delete val.content
    const match = content.match(srcReg)
    val.img = match[1]
  })
  ctx.body = res
}

async function fetchRankList(ctx) {
  let res = {},
    browse_rank = [],
    comment_rank,
    attention_rank,
    allPromise = []
  // 获取浏览排行基本数据
  let sql = `SELECT post_id, count(id) as read_times
    FROM tb_history
    GROUP BY post_id
    ORDER BY read_times DESC
    LIMIT 10`
  let browse_desc = await db.select(sql)
  // 获取评论排行基本数据
  sql = `SELECT post_id, count(id) as commented_times
    FROM tb_comment
    GROUP BY post_id
    ORDER BY commented_times DESC LIMIT 10`
  comment_rank = await db.select(sql)
  // 获取关注排行基本数据
  sql = `SELECT passive_id, count(*) as passive_attention_num
    FROM tb_user_relation
    GROUP BY passive_id
    ORDER BY passive_attention_num DESC
    LIMIT 10`
  attention_rank = await db.select(sql)
  // 处理浏览排行详细数据
  for (let key in browse_desc) {
    let val = browse_desc[key]
    sql = `SELECT post.title, post.status, user.avatar, post.id, user.username
      FROM tb_post as post
      JOIN tb_user as user ON post.user_id=user.id
      WHERE post.id = ?`
    allPromise.push(
      db.find(sql, [val['post_id']]).then((data) => {
        browse_rank.push(data)
        if (browse_rank[browse_rank.length - 1]['status'] == 2)
          browse_rank.pop()
      })
    )
  }
  // 处理评论排行详细数据
  for (let key in comment_rank) {
    // 获取每个帖子的详情 和 用户信息
    let val = comment_rank[key]
    sql = `SELECT user.nickname, user.username, user.avatar, user.sign, post.title
      FROM tb_post as post
      JOIN tb_user as user ON post.user_id=user.id
      WHERE post.id = ?`
    allPromise.push(
      db.find(sql, [val['post_id']]).then((data) => {
        comment_rank[key]['details'] = data
      })
    )
  }
  // 处理关注排行详细数据
  for (let key in attention_rank) {
    let val = attention_rank[key]
    allPromise.push(
      db
        .find(`SELECT nickname, username, avatar FROM tb_user WHERE id = ?`, [
          val['passive_id'],
        ])
        .then((data) => {
          attention_rank[key]['user_info'] = data
        })
    )
  }
  // 等待所有数据获取完成
  await Promise.all(allPromise)
  res['browse_rank'] = browse_rank
  res['comment_rank'] = comment_rank
  res['attention_rank'] = attention_rank
  ctx.body = res
}

async function fetchCateList(ctx) {
  const res = await db.select('SELECT id, name FROM `tb_main_cate`')
  ctx.body = res
}

async function fetchBrowseRank(ctx) {
  const param = ctx.request.query
  const limit = Number(param['limit'])
  const skip = Number(param['skip'])
  const browse_desc = []
  const allPromise = []
  let sql = `SELECT post_id, count(id) as read_times
    FROM tb_history
    GROUP BY post_id
    ORDER BY read_times DESC
    LIMIT ?, ?`
  let browse_desc_all = await db.select(sql, [skip, limit])
  for (let key in browse_desc_all) {
    let val = browse_desc_all[key]
    // 获取每条浏览排行中 帖子信息 和 用户头像
    sql = `SELECT post.title, post.status, user.avatar, user.nickname, user.username, user.id as user_id
      FROM tb_post as post
      JOIN tb_user as user ON post.user_id=user.id
      WHERE post.id = ?`
    allPromise.push(
      db.find(sql, [val['post_id']]).then((data) => {
        browse_desc.push(Object.assign(val, data))
        if (browse_desc[browse_desc.length - 1]['status'] == 2)
          browse_desc.pop()
      })
    )
  }
  await Promise.all(allPromise)

  ctx.body = browse_desc
}

async function fetchCommentRank(ctx) {
  const param = ctx.request.query
  const limit = Number(param['limit'])
  const skip = Number(param['skip'])
  const promiseAll = []
  let sql = `SELECT post_id, count(id) as commented_times
    FROM tb_comment
    GROUP BY post_id
    ORDER BY commented_times DESC
    LIMIT ?, ?`
  const comment_rank = await db.select(sql, [skip, limit])
  for (let key in comment_rank) {
    let val = comment_rank[key]
    // 获取每条帖子的浏览次数
    promiseAll.push(
      db.count('tb_history', `post_id = ?`, [val['post_id']]).then((data) => {
        comment_rank[key]['read_times'] = data
      })
    )
    // 获取每个帖子的详情 和 用户信息
    sql = `SELECT user.nickname, user.username, user.avatar, user.id as user_id, post.title, post.plain, post.time
      FROM tb_post as post
      JOIN tb_user as user ON post.user_id=user.id
      WHERE post.id = ?`
    promiseAll.push(
      db.find(sql, [val['post_id']]).then((data) => {
        Object.assign(val, data)
      })
    )
  }
  await Promise.all(promiseAll)
  ctx.body = comment_rank
}

async function fetchAttentionRank(ctx) {
  ctx.forceVerify()
  const param = ctx.request.query
  const visit_id = ctx.verify.id
  const limit = Number(param['limit'])
  const skip = Number(param['skip'])
  const promiseAll = []
  let sql = `SELECT passive_id, count(id) as fans_num
    FROM tb_user_relation
    GROUP BY passive_id
    ORDER BY fans_num DESC
    LIMIT ?, ?`
  const attention_rank = await db.select(sql, [skip, limit])
  for (let key in attention_rank) {
    let val = attention_rank[key]
    // 查看访问者是否关注该用户
    promiseAll.push(
      db
        .count('tb_user_relation', `active_id = ? AND passive_id = ?`, [
          visit_id,
          val['passive_id'],
        ])
        .then((data) => {
          attention_rank[key]['is_attention'] = data ? true : false
        })
    )
    promiseAll.push(
      db
        .find(`SELECT nickname, username, avatar FROM tb_user WHERE id = ?`, [
          val['passive_id'],
        ])
        .then((data) => {
          attention_rank[key] = Object.assign(val, data)
        })
    )
    attention_rank[key].self = visit_id === attention_rank[key].passive_id
  }
  await Promise.all(promiseAll)

  ctx.body = attention_rank
}

module.exports = {
  fetchRecommendPostList,
  fetchCarouselList,
  fetchRankList,
  fetchCateList,
  fetchBrowseRank,
  fetchCommentRank,
  fetchAttentionRank,
}
