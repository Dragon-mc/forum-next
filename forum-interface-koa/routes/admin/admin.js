const adminRouter = require('koa-router')()
const { lists, create, update, deleteMethod } = require('../../controllers/admin/admin')

// 获取管理员列表
adminRouter.get('/lists', lists)

// 添加管理员
adminRouter.get('/create', create)

// 编辑管理员
adminRouter.get('/update', update)

// 删除管理员
adminRouter.get('/delete', deleteMethod)

module.exports = adminRouter
