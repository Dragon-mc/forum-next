const userlistRouter = require('koa-router')()
const { lists, create, update, deleteMethod } = require('../../controllers/admin/userlist')

// 获取用户列表
userlistRouter.get('/lists', lists)

// 添加用户
userlistRouter.get('/create', create)

// 编辑用户
userlistRouter.get('/update', update)

// 删除用户
userlistRouter.get('/delete', deleteMethod)

module.exports = userlistRouter
