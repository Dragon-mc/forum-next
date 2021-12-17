import { ref, Ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { fetchPost } from '@/api/category'
import type { requestModel } from '@/types/request'
import type { postRequestParam } from '@/types/request/post'
import type { HomePostItem } from '@/types/post'
import type { CateInfo } from '@/types/category'

export default function (requestData: Ref<requestModel>, resetRequestData: Function) {
  const $route = useRoute()

  const postList = ref<Array<HomePostItem>>([])
  const cateInfo = ref<CateInfo>({})
  
  const getPostList = async () => {
    const param: postRequestParam = Object.assign({}, requestData.value)
    const query = $route.query
    if (query.main_cate) {
      param.main_cate = <string>query.main_cate
    } else if (query.sub_cate) {
      param.sub_cate = <string>query.sub_cate
    }
    let res = await fetchPost(param)
    if (res.data.post.length === 0) {
      requestData.value.hasMore = false
      ElMessage.success({ message: '没有更多数据' })
    }
    postList.value = [...postList.value, ...res.data.post]
    if (res.data.cate) cateInfo.value = res.data.cate
  }
  getPostList()

  // 监听路由变化
  watch(
    $route,
    () => {
      resetRequestData()
      postList.value = []
      getPostList()
    },
    { deep: true }
  )

  return {
    postList,
    cateInfo,
    getPostList
  }
}
