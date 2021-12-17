const router = require('koa-router')()
const frontRouter = require('./front')
const adminRouter = require('./admin')
const uploadRouter = require('./upload')

router.use('/front', frontRouter.routes())
router.use('/admin', adminRouter.routes())
router.use(uploadRouter.routes())


module.exports = router
