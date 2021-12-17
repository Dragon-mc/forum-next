const oauthRouter = require('koa-router')()
const { login, bind, unbind } = require('../../controllers/front/oauth')

// 第三方登录
oauthRouter.post('/login', login)

oauthRouter.post('/bind', bind)

oauthRouter.post('/unbind', unbind)

module.exports = oauthRouter
