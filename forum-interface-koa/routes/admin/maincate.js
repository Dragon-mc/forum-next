const maincateRouter = require('koa-router')()
const { lists, create, update, deleteMethod, updateStatus } = require('../../controllers/admin/maincate')

// 获取主分类列表
maincateRouter.get('/lists', lists)

// 添加主分类
maincateRouter.get('/create', create)

// 更新主分类
maincateRouter.get('/update', update)

// 删除主分类
maincateRouter.get('/delete', deleteMethod)

// 更新主分类状态
maincateRouter.get('/update_status', updateStatus)

module.exports = maincateRouter
