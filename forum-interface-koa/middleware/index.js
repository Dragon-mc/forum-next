const router = require('../routes')
const path = require('path')
const koaBody = require('koa-body')
const json = require('koa-json')
const logger = require('koa-logger')
const static = require('koa-static')
const cors = require('koa2-cors')
const jwt = require('./tokenVerify')
const response = require('./response')
const error = require('./error')

/**
 * 路由
 */
const mdRoute = router.routes()
const mdRouterAllowed = router.allowedMethods()

/**
 * post参数与文件处理
 */
const mdBody = koaBody({
  multipart: true,  // 支持表单上传
  formidable: {
    maxFileSize: 20 * 1024 * 1024, // 修改文件大小限制，默认位2M
    keepExtensions: true,
  }
})
const mdJson = json()
const mdLogger = logger()
const mdStatic = static(path.join(__dirname, '../public'))

/**
 * cors
 */
const mdCORS = cors({
  origin: function(ctx) { //设置允许来自指定域名请求
    return ctx.request.header.origin
  },
  maxAge: 5, //指定本次预检请求的有效期，单位为秒。
  credentials: true, //是否允许发送Cookie
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法'
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'], //设置服务器支持的所有头信息字段
})

/**
 * jwt
 */
const mdJwt = jwt()

/**
 * error logger
 */
const mdErrorLogger = async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
}

/**
 * response handler
 */
const mdResponse = response()
const mdError = error()


module.exports = [
  mdBody,
  mdJson,
  mdLogger,
  mdStatic,
  mdCORS,
  mdResponse,
  mdError,
  mdJwt,
  mdErrorLogger,
  mdRoute,
  mdRouterAllowed,
]
