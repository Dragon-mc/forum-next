const userRouter = require('koa-router')()
const {
  login,
  info,
  logout,
  fetchIndexInfo,
  uploadAvatar,
  setSessionAvatar
} = require('../../controllers/admin/user')

// 用户登录
userRouter.post('/login', login)

// 根据token获取用户信息
userRouter.get('/info', info)

// 用户注销
userRouter.post('/logout', logout)

// 获取首页系统的数据
userRouter.post('/fetch_index_info', fetchIndexInfo)

// 上传用户头像
userRouter.post('/upload_avatar', uploadAvatar)

// 用户上传头像成功后，同时更新session中当前登录时保存的头像
userRouter.post('/set_session_avatar', setSessionAvatar)

module.exports = userRouter
