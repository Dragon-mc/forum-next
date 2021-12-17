/**
 * jsonWebToken配置
 * jwtConfig.js
 */

 const jwtHeader = {
  typ:'JWT',
  alg:'SHA256'
}

const jwtSecret = 'forum-token-secret'

const expire = 60 * 60 * 1
const refreshExpire = 60 * 60 * 24 * 14

module.exports = { jwtHeader, jwtSecret, expire, refreshExpire }