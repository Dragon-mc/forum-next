import { paginationModel } from './index'
import type { UserCenterInfo } from '@/types/user'

export interface requestUserCenterInfo {
  username: string
}

export interface requestFetchCollection extends paginationModel {
  id: string | number
}

export type requestFetchPublish = requestFetchCollection

export type requestFetchDraftPost = requestFetchCollection

export type requestFetchAttention = requestFetchCollection

export type requestFetchFans = requestFetchCollection

export type requestFetchHistory = requestFetchCollection

export type requestModifyProfile = UserCenterInfo