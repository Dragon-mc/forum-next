const frontRouter = require('koa-router')()

const homeRouter = require('./home')
const userRouter = require('./user')
const userCenterRouter = require('./userCenter')
const searchRouter = require('./search')
const postRouter = require('./post')
const categoryRouter = require('./category')
const oauthRouter = require('./oauth')

frontRouter.use('/index', homeRouter.routes())
frontRouter.use('/user', userRouter.routes())
frontRouter.use('/user_center', userCenterRouter.routes())
frontRouter.use('/search', searchRouter.routes())
frontRouter.use('/post', postRouter.routes())
frontRouter.use('/category', categoryRouter.routes())
frontRouter.use('/oauth', oauthRouter.routes())

module.exports = frontRouter