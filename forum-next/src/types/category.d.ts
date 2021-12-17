// 分类名称列表
export interface CategoryNameList {
  id: number | string
  name: string,
  sub_cate?: Array<CategoryNameList>
}

// 分类页分类信息
interface CateInfo {
  name?: string
  desc?: string
}
