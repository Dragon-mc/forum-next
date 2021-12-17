/**
 * jwt认证 jwt.js
 */

 const crypto = require('crypto')
 const { jwtHeader, jwtSecret, expire, refreshExpire } = require('../config/jwt.config')
 
 module.exports = class Jwt{
   createToken(data, refresh = false) {
     let created = Math.floor(Date.now() / 1000)
     // 载荷
     const jwtPayload = {
       data,
       ita: created, // 创建时间
       exp: created + (refresh ? refreshExpire : expire) // 过期时间
     }
     // base64编码头部
     let base64Header = this.encodeBase64(jwtHeader)
     // base64编码载荷
     let base64Payload = this.encodeBase64(jwtPayload)
     // 加密头部和载荷，形成签名
     let signature = crypto.createHmac('sha256', jwtSecret).update(`${base64Header}.${base64Payload}`).digest('base64')
     // 最后将头部、载荷、签名用.连接，形成最终的token
     return `${base64Header}.${base64Payload}.${signature}`
   }
 
   tokenVerify(token) {
     // 检查token是否存在
     if (!token) return { pass: false, msg: 'token不存在' }
     // 删除token中的头部
     token = token.replace('Bearer ', '')
     let { header, payload, signature } = this.parseToken(token)
     let check = crypto.createHmac('sha256', jwtSecret).update(`${header}.${payload}`).digest('base64')
     // 如果传来的数据经过加密跟签名不同，则token被篡改了
     if (check !== signature) return { pass: false, msg: 'token非法' }
     // 对payload进行解密，验证时间是否过期
     let time = Math.floor(Date.now() / 1000)
     // 解析出base64编码的载荷
     let realPayload = this.decodeBase64(payload)
     // 验证时间是否过期
     if (time >= realPayload.exp) return { pass: false, msg: 'token已过期' }
     // 如果经过验证没有问题，则返回载荷中的data
     return { pass: true, msg: '验证成功', data: realPayload.data }
   }
 
   parseToken(token) {
     let jwtArr = token.split('.')
     return {
       header: jwtArr[0],
       payload: jwtArr[1],
       signature: jwtArr[2]
     }
   }
 
   encodeBase64(content) {
     return Buffer.from(JSON.stringify(content)).toString('base64')
   }
 
   decodeBase64(content) {
     return JSON.parse(Buffer.from(content, 'base64').toString())
   }
 }
 