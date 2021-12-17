const subcateRouter = require('koa-router')()
const { lists, mainCate, create, update, deleteMethod, updateStatus } = require('../../controllers/admin/subcate')

// 获取次分类列表
subcateRouter.get('/lists', lists)

// 获取主分类
subcateRouter.get('/main_cate', mainCate)

// 添加次分类
subcateRouter.get('/create', create)

// 更新次分类
subcateRouter.get('/update', update)

// 删除次分类
subcateRouter.get('/delete', deleteMethod)

// 更新次分类状态
subcateRouter.get('/update_status', updateStatus)

module.exports = subcateRouter
