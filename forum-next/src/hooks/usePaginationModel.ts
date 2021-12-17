import { ref } from 'vue'
import type { paginationModel } from '@/types/request/index'

export default function(limit: number = 5) {
  const total = ref(0)
  const loading = ref(false)
  const paginationData = ref<paginationModel>({
    limit,
    page: 1,
  })

  const handlePageChange = async (page: number, refreshFunc: Function) => {
    loading.value = true
    paginationData.value.page = page
    try {
      await refreshFunc()
    } finally {
      loading.value = false
    }
  }

  return {
    total,
    paginationData,
    loading,
    handlePageChange
  }
}