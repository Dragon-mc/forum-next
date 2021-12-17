/**
 * 错误类
 */

const stateCode = require('../config/stateCode.config')

class BaseError extends Error {
  constructor(message, code) {
    super(message)
    this.code = code
  }
}

class FailedError extends BaseError {
  constructor(message) {
    super(message, stateCode.FAILED)
  }
}

class ValidateFailedError extends BaseError {
  constructor(message) {
    super(message, stateCode.VALIDATE_FAILED)
  }
}

class UnauthorizedError extends BaseError {
  constructor(message) {
    super(message, stateCode.UNAUTHORIZED)
  }
}

class ForbiddenError extends BaseError {
  constructor(message) {
    super(message, stateCode.FORBIDDEN)
  }
}

module.exports = {
  BaseError,
  FailedError,
  ValidateFailedError,
  UnauthorizedError,
  ForbiddenError
}
