const crypto = require('crypto')
const captchapng = require('captchapng')

module.exports = {
  md5(str) {
    return crypto.createHash('md5').update(str, 'utf8').digest('hex')
  },
  // 获取当前时间
  getNowDate() {
    const date = new Date()
    return `${date.getFullYear()}-${patchZero(date.getMonth() + 1)}-${patchZero(
      date.getDate()
    )} ${patchZero(date.getHours())}:${patchZero(
      date.getMinutes()
    )}:${patchZero(date.getSeconds())}`
  },
  // 获取验证码
  getVcode(token, ctx) {
    let val = parseInt(Math.random() * 9000 + 1000)
    ctx.session[token] = val.toString()
    // 利用库生成验证码 返回base64编码
    let p = new captchapng(120, 40, val)
    p.color(0, 0, 0, 0)
    p.color(80, 80, 80, 255)
    let imgBase64 = p.getBase64()
    return imgBase64
  },
  // 获取当前运行环境
  getNodeEnv() {
    return process.argv[2]
  },
  // 抛出异常
  throwError(err) {
    throw err
  },
}

function patchZero(num) {
  if (num < 10) {
    return '0' + num
  } else {
    return num
  }
}
