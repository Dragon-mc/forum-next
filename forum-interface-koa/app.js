const Koa = require('koa')
const app = new Koa()
const onerror = require('koa-onerror')
const session = require('koa-session')
const compose = require('koa-compose')
const middleware = require('./middleware')
const { throwError } = require('./utils')

// error handler
onerror(app)

// session
app.keys = ['forum-secret-koa']
const CONFIG = {
   key: 'KOA_SESSIONID',   //cookie key (default is koa:sess)
   maxAge: 1000 * 3600 * 2,  // cookie的过期时间 maxAge in ms (default is 1 days)
   overwrite: true,  //是否可以overwrite    (默认default true)
   httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
   signed: true,   //签名默认true
   rolling: false,  //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
   renew: false,  //(boolean) renew session when session is nearly expired,
}
app.use(session(CONFIG, app))

app.use(compose(middleware))

app.context.throwError = throwError

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
