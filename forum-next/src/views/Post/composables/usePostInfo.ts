import { ref } from 'vue'
import type { PostDetailInfo } from '@/types/post'
import { fetchPostInfo } from '@/api/post'

export default function (postId: number | string, handleCollection: Function) {
  const postInfo = ref<PostDetailInfo | null>(null)

  const getPostInfo = async () => {
    let res = await fetchPostInfo({
      id: postId,
    })
    postInfo.value = res.data
  }
  getPostInfo()

  const handleCollectionPost = async () => {
    const res = await handleCollection(
      postInfo?.value?.is_collection,
      postInfo?.value?.id,
      () =>
        postInfo.value && (postInfo.value.is_collection = !postInfo.value.is_collection)
    )
    // 收藏或取消收藏后更新页面数据
    if (res) {
      res.collection
        ? postInfo.value && postInfo.value.collection_times++
        : postInfo.value && postInfo.value.collection_times--
    }
  }

  const handleFansChange = (value: number) => {
    postInfo.value && (postInfo.value.user_info.fans_num += value)
  }

  return {
    postInfo,
    getPostInfo,
    handleCollectionPost,
    handleFansChange
  }
}