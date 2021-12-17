const postRouter = require('koa-router')()
const { lists, subCate, create, update, deleteMethod, updateStatus } = require('../../controllers/admin/post')

// 获取帖子列表
postRouter.get('/lists', lists)

// 获取次分类列表
postRouter.get('/sub_cate', subCate)

// 添加帖子
postRouter.post('/create', create)

// 编辑帖子
postRouter.post('/update', update)

// 删除帖子
postRouter.get('/delete', deleteMethod)

// 更新帖子状态
postRouter.get('/update_status', updateStatus)

module.exports = postRouter
