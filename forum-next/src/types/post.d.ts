import { PostDetailUserInfo } from './user'

export interface PostInfo {
  content: string
  id: number | string
  status: number
  sub_id: number | string
  time: string
  title: string
  type: 1 | 2
  user_id: number | string
}

type PostExcludeContent = Omit<PostInfo, 'content'>

export interface HomePostItem extends PostExcludeContent {
  avatar: string | null
  comment_times: number
  plain: string
  nickname: string | null
  read_times: number
  username: string
}

export interface CollectionPostItem extends HomePostItem {
  collection_time: string
  is_collection: boolean
}

export interface PublishPostItem extends PostExcludeContent {
  comment_times: number
  plain: string
  read_times: number
}

export interface DraftPostItem extends PostExcludeContent {
  plain: string
}

export interface SearchResultPostItem extends PostExcludeContent {
  avatar: string | null
  comment_times: number
  plain: string
  nickname: string | null
  read_times: number
  username: string
}

export interface PostDetailInfo extends PostExcludeContent {
  cate_name: string
  collection_times: number
  comment_times: number
  content: string
  is_collection: boolean
  read_times: number
  user_info: PostDetailUserInfo
}

export interface PostCommentItem {
  avatar: string | null
  content: string
  id: number | string
  nickname: string | null
  post_id: number | string
  reply_info: Array<PostCommentReplyItem>
  time: string
  user_id: number | string
  username: string
}

export interface PostCommentReplyItem {
  avatar: string
  comment_id: number | string
  content: string
  id: number | string
  nickname: string | null
  passive_nickname: string | null
  passive_user_id: number | string
  passive_username: string
  time: string
  user_id: number | string
  username: string
}
