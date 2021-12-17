import { ref, Ref } from 'vue'
import { fetchCommentRank } from '@/api/index'
import type { requestModel } from '@/types/request'
import type { CommentRankDetailItem } from '@/types/rank'

export default function (requestData: Ref<requestModel>) {
  
  const commentRankList = ref<Array<CommentRankDetailItem>>([])

  const getCommentRankList = async () => {
    if (requestData.value.skip >= 80) return
    let res = await fetchCommentRank(requestData.value)
    if (res.data.length === 0) {
      requestData.value.hasMore = false
      return
    }
    commentRankList.value = [...commentRankList.value, ...res.data]
  }
  getCommentRankList()

  return {
    commentRankList,
    getCommentRankList
  }
}