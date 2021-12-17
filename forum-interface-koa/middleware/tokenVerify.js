const Jwt = require('../utils/jwt')
const { ForbiddenError, UnauthorizedError } = require('../utils/Error')

const myJwt = new Jwt()

const EMPTY = '__empty__'

/**
 * 添加验证用户信息函数
 */
const jwt = () => {
  return async function (ctx, next) {
    const token = ctx.request.header['Authorization'] || ctx.request.header['authorization']
    ctx.forceVerify = forceVerify.bind(ctx)
    const res = myJwt.tokenVerify(token)
    if (typeof token !== 'undefined' && !res.pass) {
      // 携带token，未通过验证
      return ctx.throwError(new UnauthorizedError(res.msg))
    }
    ctx.jwt = myJwt
    // 添加token通过标识
    ctx.verify = {
      valid: res.pass
    }
    // 通过添加真实id，未通过添加空标记
    if (res.pass) ctx.verify.id = res.data.uid
    else ctx.verify.id = EMPTY
    await next()
  }
}

// 强制验证，只有token合法才验证成功
function forceVerify() {
  // 验证失败的请求直接返回错误
  if (!this.verify.valid) {
    this.throwError(new ForbiddenError('token非法'))
  }
}

module.exports = jwt
