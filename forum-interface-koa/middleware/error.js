const { BaseError } = require('../utils/Error')

const error = () => {
  return async (ctx, next) => {
    try {
      await next()
      ctx.res.success()
    } catch (err) {
      if (err instanceof BaseError) {
        // 存在用户抛出的错误
        ctx.res.fail(err.message, err.code)
      } else {
        ctx.res.fail(err.message)
      }
    }
  }
}

module.exports = error
