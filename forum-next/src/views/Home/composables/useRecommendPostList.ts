import { ref, Ref } from 'vue'
import { fetchRecommendPostList } from '@/api'
import { ElMessage } from 'element-plus'
import { HomePostItem } from '@/types/post'
import type { requestModel } from '@/types/request'

export default function (requestData: Ref<requestModel>) {
  const recommendPostList = ref<Array<HomePostItem>>([])
  const getRecommendPostList = async () => {
    let res = await fetchRecommendPostList({
      limit: requestData.value.limit,
      skip: requestData.value.skip
    })
    if (res.data.length === 0) {
      requestData.value.hasMore = false
      ElMessage.success({ message: '没有更多数据' })
    }
    recommendPostList.value = [...recommendPostList.value, ...res.data]
  }
  getRecommendPostList()

  return {
    recommendPostList,
    getRecommendPostList
  }
}
