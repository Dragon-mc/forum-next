const searchRouter = require('koa-router')()
const { fetchSearchPost } = require('../../controllers/front/search')

// 获取指定关键字的帖子列表
searchRouter.get('/fetch_search_post', fetchSearchPost)

module.exports = searchRouter
