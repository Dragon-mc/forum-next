const categoryRouter = require('koa-router')()
const { fetchPost, fetchCategory } = require('../../controllers/front/category')

// 获取分类页面中指定分类的所有帖子
categoryRouter.get('/fetch_post', fetchPost)

// 获取分类页面所有分类
categoryRouter.get('/fetch_category', fetchCategory)

module.exports = categoryRouter
