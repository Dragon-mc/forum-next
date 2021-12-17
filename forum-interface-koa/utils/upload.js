/**
 * 文件上传处理 upload.js
 */

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const uploadConfigAll = require('../config/upload.config')
const stateCode = require('../config/stateCode.config')
const { getNodeEnv } = require('../utils')

const uploadConfig = uploadConfigAll[getNodeEnv()]

module.exports = class Upload {
  // 将上传的文件保存
  async multiUpload(FILE) {
    if (!FILE || !FILE['file']) return
    FILE = FILE['file']
    const date = new Date()
    const dateDir =
      date.getFullYear().toString() +
      (date.getMonth() < 9
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1
      ).toString() +
      date.getDate().toString()
    const dir = path.join(uploadConfig.shareDir, 'upload', dateDir)
    const retDir = path.join('upload', dateDir)
    const absDir = path.join(uploadConfig.absolute_path, dir)
    const filename = this.unique() + path.extname(FILE['name'])
    // 判断目录是否存在，不存在则创建
    if (!fs.existsSync(absDir)) {
      fs.mkdirSync(absDir, { recursive: true })
    }
    // 将文件数据保存到本地磁盘
    try {
      //  await fs.promises.writeFile(path.join(absDir, filename), FILE.data)
      // 创建可读流
      const reader = fs.createReadStream(FILE['path'])
      // 创建可写流
      const upStream = fs.createWriteStream(path.join(absDir, filename))
      // 可读流通过管道写入可写流
      reader.pipe(upStream)
    } catch (e) {
      return { code: stateCode.FAILED, message: e.message }
    }
    return {
      code: stateCode.SUCCESS,
      data: { url: uploadConfig.domain + '/' + path.join(retDir, filename).replace(/\\/g, '/') },
    }
  }

  // 删除上传的文件
  async deletePhoto(savePath) {
    if (!savePath) return
    const photoPath = savePath.replace(
      uploadConfig.domain,
      path.join(uploadConfig.absolute_path, uploadConfig.shareDir)
    )
    if (fs.existsSync(photoPath)) {
      // 如果文件存在则删除文件
      fs.unlink(photoPath, () => {})
    }
  }

  unique() {
    const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789'
    let uni = ''
    //以长度单位进行循环
    for (let i = 0; i < 32; i++) {
      uni += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return crypto.createHash('md5').update(uni, 'utf8').digest('hex')
  }
}
