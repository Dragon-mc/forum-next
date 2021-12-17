import type { UserInfo } from './user'

// 浏览排名
export interface BrowseRankItemType {
  avatar: string
  id: string | number
  status: number
  title: string
  username: string
}

// 浏览排名详情
export interface BrowseRankDetailItem {
  avatar: string
  nickname: string
  post_id: string | number
  read_times: number
  status: number
  title: string
  user_id: string | number
  username: string
}

interface CommentItemDetail {
  avatar: string
  nickname: string
  sign: string | null
  title: string
  username: string
}

// 评论排名
export interface CommentRankItemType {
  commented_times: number
  details: CommentItemDetail
  post_id: number | string
}

// 评论排行详情
export interface CommentRankDetailItem {
  avatar: string
  commented_times: number
  plain: string
  nickname: string
  post_id: string | number
  read_times: number
  time: string
  title: string
  user_id: number | string
  username: string
}

// 关注排名
export interface AttentionRankItemType {
  passive_attention_num: number
  passive_id: number | string
  user_info: UserInfo
}

// 关注排名详情
export interface AttentionRankDetailItem {
  avatar: string
  fans_num: number
  is_attention: boolean
  nickname: string
  passive_id: number | string
  self: boolean
  username: string
}
