import { ref } from 'vue'
import { fetchCateList } from '@/api'
import type { CategoryNameList } from '@/types/category'

export default function () {
  const cateListWidth = ref('')
  const cateList = ref<Array<CategoryNameList>>([])
  const getCateList = async () => {
    let res = await fetchCateList()
    cateList.value = res.data
    // 计算分类列表宽度
    cateListWidth.value = 85 * cateList.value.length + 'px'
  }
  getCateList()
  return {
    cateList,
    cateListWidth
  }
}
