const fs = require('fs')
const path = require('path')

function resolve(sol) {
  return path.join(__dirname, sol)
}

/**
 * 系统配置文件
 */

module.exports = {
  // 默认运行端口号
  port: '3001',
  // ssl证书
  ssl: {
    key: fs.readFileSync(resolve('../ssl/tonyang.vip.key')),
    cert: fs.readFileSync(resolve('../ssl/tonyang.vip_bundle.pem'))
  },
  baseUrl: 'https://tonyang.vip'
}