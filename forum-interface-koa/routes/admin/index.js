const adminRouter = require('koa-router')()

const adminControllerRouter = require('./admin')
const commentRouter = require('./comment')
const feedbackRouter = require('./feedback')
const maincateRouter = require('./maincate')
const postRouter = require('./post')
const replyRouter = require('./reply')
const subcateRouter = require('./subcate')
const userRouter = require('./user')
const userlistRouter = require('./userlist')

adminRouter.use('/admin', adminControllerRouter.routes())
adminRouter.use('/comment', commentRouter.routes())
adminRouter.use('/feedback', feedbackRouter.routes())
adminRouter.use('/maincate', maincateRouter.routes())
adminRouter.use('/post', postRouter.routes())
adminRouter.use('/reply', replyRouter.routes())
adminRouter.use('/subcate', subcateRouter.routes())
adminRouter.use('/user', userRouter.routes())
adminRouter.use('/userlist', userlistRouter.routes())

module.exports = adminRouter
