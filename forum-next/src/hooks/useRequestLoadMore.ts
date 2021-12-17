import { Ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { requestModel } from '@/types/request'

export default function (requestData: Ref<requestModel>, loadMoreFunc: Function) {
  let hasShowMessage = false
  const handleLoadMore = () => {
    if (requestData.value.hasMore) {
      requestData.value.skip += requestData.value.limit
      loadMoreFunc()
    } else {
      if (!hasShowMessage) {
        hasShowMessage = true
        ElMessage.success({
          message: '没有更多数据',
          onClose: () => {
            hasShowMessage = false
          },
        })
      }
    }
  }
  
  return {
    handleLoadMore
  }
}
