const router = require('koa-router')()
const path = require('path')
const fse = require('fs-extra')

const targetDir = path.join(__dirname, '../target')

router.post('/large_upload', (ctx) => {
  const body = ctx.request.body
  const files = ctx.request.files.chunk

  // 存储切片的文件
  const ext = path.extname(body.filename).replace('.', '')
  const chunkDir = path.join(targetDir, body.hash + ext)
  
  // 文件目录不存在则创建
  if (!fse.existsSync(targetDir)) {
    fse.mkdirSync(targetDir, { recursive: true })
  }
  if (!fse.existsSync(chunkDir)) {
    fse.mkdirSync(chunkDir, { recursive: true })
  }

  const reader = fse.createReadStream(files['path'])
  // 创建可写流
  const upStream = fse.createWriteStream(path.join(chunkDir, body.index + '-' + body.hash))
  // 可读流通过管道写入可写流
  reader.pipe(upStream)

  ctx.body = {
    code: 20000
  }
})

router.post('/upload_merge', async (ctx) => {
  const { filename, hash, size } = ctx.request.body
  const ext = path.extname(filename).replace('.', '')
  const chunkDir = path.join(targetDir, hash + ext)
  const saveDir = path.join(__dirname, '../upload')

  if (!fse.existsSync(saveDir)) {
    fse.mkdirSync(saveDir, { recursive: true })
  }

  const chunkPaths = await fse.readdir(chunkDir)
  // 排序，防止文件顺序错乱
  chunkPaths.sort((a, b) => a.split('-')[0] - b.split('-')[0])
  await Promise.all(
    chunkPaths.map((chunkPath, index) => {
      const realPath = path.join(chunkDir, chunkPath)
      return new Promise(resolve => {
        const reader = fse.createReadStream(realPath)
        reader.on('end', () => {
          fse.unlinkSync(realPath)
          resolve()
        })
        const upStream = fse.createWriteStream(path.join(saveDir, filename), {
          start: index * size,
          end: (index + 1) * size
        })
        reader.pipe(upStream)
      })
    })
  )
  try {
    fse.rmdirSync(chunkDir)
  } catch (e) {
    console.log(e.message)
  }
  ctx.body = {
    code: 20000
  }
})

router.get('/upload_list', async (ctx) => {
  const { hash, filename, chunkLength } = ctx.request.query
  const ext = path.extname(filename).replace('.', '')
  const chunkDir = path.join(targetDir, hash + ext)
  let chunkPaths
  
  // 尝试获取文件夹中的内容
  if (fse.existsSync(chunkDir)) {
    chunkPaths = await fse.readdir(chunkDir)
    if (chunkPaths.length == chunkLength) {
      // chunk已经全部上传，还未合并
      return ctx.body = {
        code: 20000,
        shouldUpload: false
      }
    }
  }

  ctx.body = {
    code: 20000,
    shouldUpload: true,
    uploadedList: chunkPaths || []
  }
})

module.exports = router