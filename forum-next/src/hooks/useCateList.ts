import { ref } from 'vue'
import { fetchCategory } from '@/api/category'
import type { CategoryNameList } from '@/types/category'

export default function () {
  const cateList = ref<Array<CategoryNameList>>([])
  const getCateList = async () => {
    let res = await fetchCategory()
    cateList.value = res.data
  }

  return {
    cateList,
    getCateList
  }
}
