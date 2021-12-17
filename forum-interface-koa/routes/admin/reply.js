const replyRouter = require('koa-router')()
const { lists, create, update, deleteMethod } = require('../../controllers/admin/reply')

// 获取用户回复列表
replyRouter.get('/lists', lists)

// 添加回复
replyRouter.get('/create', create)

// 编辑回复
replyRouter.get('/update', update)

// 删除回复
replyRouter.get('/delete', deleteMethod)

module.exports = replyRouter
