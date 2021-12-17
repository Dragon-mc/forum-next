import { ref } from 'vue'
import type { requestModel } from '@/types/request'

export default function () {
  const requestData = ref<requestModel>({
    limit: 20,
    skip: 0,
    hasMore: true
  })
  const resetRequestData = () => {
    requestData.value.limit = 20
    requestData.value.skip = 0
    requestData.value.hasMore = true
  }
  return {
    requestData,
    resetRequestData
  }
}