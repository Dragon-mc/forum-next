import request from '@/utils/request'
import type {
  requestPostInfo,
  requestEditPostInfo,
  requestCommentInfo,
  requestPostComment,
  requestPostReply,
  requestDelPost,
  requestUploadImg,
  requestPostPublish,
  requestPostEdit,
} from '@/types/request/post'

export function fetchPostInfo(data: requestPostInfo) {
  return request({
    url: '/front/post/fetch_post_info',
    method: 'get',
    params: data,
  })
}

export function fetchEditPostInfo(data: requestEditPostInfo) {
  return request({
    url: '/front/post/fetch_edit_post_info',
    method: 'get',
    params: data,
  })
}

export function fetchCommentInfo(data: requestCommentInfo) {
  return request({
    url: '/front/post/fetch_comment_info',
    method: 'get',
    params: data,
  })
}

export function comment(data: requestPostComment) {
  return request({
    url: '/front/post/comment',
    method: 'get',
    params: data,
  })
}

export function reply(data: requestPostReply) {
  return request({
    url: '/front/post/reply',
    method: 'get',
    params: data,
  })
}

export function deletePost(data: requestDelPost) {
  return request({
    url: '/front/post/delete_post',
    method: 'get',
    params: data,
  })
}

// 发布帖子时 上传图片
export function uploadImg(data: requestUploadImg) {
  return request({
    url: '/front/post/upload_img',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data,
  })
}

export function postPublish(data: requestPostPublish) {
  return request({
    url: '/front/post/post_publish',
    method: 'post',
    data,
  })
}

export function postEdit(data: requestPostEdit) {
  return request({
    url: '/front/post/post_edit',
    method: 'post',
    data,
  })
}
