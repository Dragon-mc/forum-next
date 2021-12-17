export interface requestDataParam {
  limit: number,
  skip: number
}

export interface requestModel extends requestDataParam {
  hasMore: boolean
}

export interface paginationModel {
  limit: number,
  page: number
}
