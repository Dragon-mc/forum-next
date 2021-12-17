import type { paginationModel } from './index'

export interface requestSearchPost extends paginationModel {
  keywords: string
}