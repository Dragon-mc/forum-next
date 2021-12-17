import { requestModel, requestDataParam, paginationModel } from './index.d'
import type { PostInfo } from '@/types/post'

type idType = string | number

export interface postRequestParam extends requestModel {
  main_cate?: string | number
  sub_cate?: string | number
}

interface id {
  id: idType
}
interface postId {
  post_id: idType
}

export type requestPostInfo = id

export type requestEditPostInfo = postId

export interface requestCommentInfo extends paginationModel, requestEditPostInfo {}

export interface requestPostComment {
  post_id: idType
  content: string
  time: string
}

export interface requestPostReply {
  passive_user_id: idType
  comment_id: idType
  time: string
  content: string
}

export type requestDelPost = postId

export type requestUploadImg = FormData

export interface requestPostPublish extends Omit<PostInfo, 'id' | 'user_id'> {
  plain: string
}

export interface requestPostEdit extends Omit<PostInfo, 'user_id' | 'type'> {
  plain: stirng
  status?: number
  time?: string
}
