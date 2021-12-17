const stateCode = require('../config/stateCode.config')

const response = () => {
  return async (ctx, next) => {
    ctx.res.fail = (message, code) => {
      ctx.body = {
        code: code || stateCode.FAILED,
        message: message || 'fail'
      }
    }

    ctx.res.success = (message) => {
      ctx.body = {
        code: stateCode.SUCCESS,
        data: ctx.body,
        message: message || 'success'
      }
    }

    await next()
  }
}

module.exports = response
