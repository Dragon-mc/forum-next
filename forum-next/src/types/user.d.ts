export interface UserInfo {
  avatar?: string
  create_time?: string
  id?: string | number
  introduction?: string
  last_time?: string
  nickname?: string | null
  sex?: string
  sign?: string
  username?: string
}

export interface UserCenterInfo extends UserInfo {
  fans_num?: number
  attention_num?: number
  is_attention?: boolean
  self?: boolean
  third_party?: { [attr: string]: boolean }
}

// 用户关注和粉丝数据
export interface UserRelationItem extends UserInfo {
  is_attention: boolean
  self: boolean
}

export interface UserHistoryItem {
  avatar: string
  comment_times: number
  plain: string
  history_time: string
  id: string | number
  nickname: string | null
  read_times: number
  status: number
  sub_id: number | string
  time: string
  title: string
  type: number
  user_id: number | string
  username: string
}

export interface PostDetailUserInfo extends UserInfo {
  attention_num: number
  collection_num: number
  comment_num: number
  fans_num: number
  is_attention: boolean
  self: boolean
}
