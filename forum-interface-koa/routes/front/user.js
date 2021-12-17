const userRouter = require('koa-router')()
const {
  getVerifyCode,
  register,
  login,
  refreshToken,
  getUserInfo,
  checkUserExist,
  cancelAttention,
  attention,
  calcelCollection,
  collection,
  history,
  feedback,
  modifyPassword
} = require('../../controllers/front/user')

// 获取验证码，返回验证码图片的base64编码数据
userRouter.post('/get_verify_code', getVerifyCode)

// 用户注册
userRouter.post('/register', register)

// 用户登录
userRouter.post('/login', login)

// 刷新token
userRouter.post('/refresh_token', refreshToken)

// 获取用户信息
userRouter.get('/get_user_info', getUserInfo)

// 检查用户名是否存在
userRouter.get('/check_user_exist', checkUserExist)

// 取消关注指定用户
userRouter.get('/cancel_attention', cancelAttention)

// 关注指定用户
userRouter.get('/attention', attention)

// 取消收藏指定帖子
userRouter.get('/calcel_collection', calcelCollection)

// 收藏指定帖子
userRouter.get('/collection', collection)

// 添加浏览历史，并增加阅读次数
userRouter.get('/history', history)

// 反馈意见
userRouter.get('/feedback', feedback)

// 修改用户密码
userRouter.post('/modify_password', modifyPassword)

module.exports = userRouter
