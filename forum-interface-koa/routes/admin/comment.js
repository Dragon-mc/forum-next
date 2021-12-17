const commentRouter = require('koa-router')()
const { lists, create, update, deleteMethod } = require('../../controllers/admin/comment')

// 获取评论列表
commentRouter.get('/lists', lists)

// 添加评论
commentRouter.get('/create', create)

// 更新评论
commentRouter.get('/update', update)

// 删除评论
commentRouter.get('/delete', deleteMethod)

module.exports = commentRouter
