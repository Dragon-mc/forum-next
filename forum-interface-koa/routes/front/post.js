const postRouter = require('koa-router')()
const {
  fetchPostInfo,
  fetchEditPostInfo,
  fetchCommentInfo,
  comment,
  reply,
  deletePost,
  uploadImg,
  postPublish,
  postEdit
} = require('../../controllers/front/post')

// 获取帖子信息
postRouter.get('/fetch_post_info', fetchPostInfo)

// 获取编辑帖子时的信息
postRouter.get('/fetch_edit_post_info', fetchEditPostInfo)

// 获取帖子评论信息
postRouter.get('/fetch_comment_info', fetchCommentInfo)

// 评论帖子
postRouter.get('/comment', comment)

// 回复帖子评论
postRouter.get('/reply', reply)

// 删除帖子
postRouter.get('/delete_post', deletePost)

// 发布帖子时，上传图片
postRouter.post('/upload_img', uploadImg)

// 发布帖子
postRouter.post('/post_publish', postPublish)

// 编辑帖子
postRouter.post('/post_edit', postEdit)

module.exports = postRouter
