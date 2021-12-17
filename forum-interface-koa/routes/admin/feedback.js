const feedbackRouter = require('koa-router')()
const { lists, replyUser, deleteMethod } = require('../../controllers/admin/feedback')

// 获取反馈列表
feedbackRouter.get('/lists', lists)

// 回复用户反馈
feedbackRouter.get('/reply_user', replyUser)

// 删除反馈
feedbackRouter.get('/delete', deleteMethod)

module.exports = feedbackRouter
