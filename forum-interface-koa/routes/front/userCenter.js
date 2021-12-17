const userCenterRouter = require('koa-router')()
const {
  getUserInfo,
  fetchCollection,
  fetchPublish,
  fetchDraftPost,
  fetchAttention,
  fetchFans,
  fetchHistory,
  modifyProfile,
  uploadAvatar
} = require('../../controllers/front/userCenter')

// 获取用户信息
userCenterRouter.get('/get_user_info', getUserInfo)

// 获取收藏列表
userCenterRouter.get('/fetch_collection', fetchCollection)

// 获取发布帖子的列表
userCenterRouter.get('/fetch_publish', fetchPublish)

// 获取待发布帖子
userCenterRouter.get('/fetch_draft_post', fetchDraftPost)

// 获取关注列表
userCenterRouter.get('/fetch_attention', fetchAttention)

// 获取粉丝列表
userCenterRouter.get('/fetch_fans', fetchFans)

// 获取历史记录
userCenterRouter.get('/fetch_history', fetchHistory)

// 修改用户信息
userCenterRouter.post('/modify_profile', modifyProfile)

// 上传用户头像
userCenterRouter.post('/upload_avatar', uploadAvatar)

module.exports = userCenterRouter
