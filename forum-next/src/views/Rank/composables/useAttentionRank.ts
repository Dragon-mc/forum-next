import { ref, Ref } from 'vue'
import { fetchAttentionRank } from '@/api/index'
import type { requestModel } from '@/types/request'
import type { AttentionRankDetailItem } from '@/types/rank'

export default function (requestData: Ref<requestModel>) {
  const attentionRankList = ref<Array<AttentionRankDetailItem>>([])
  const getAttentionRankList = async () => {
    if (requestData.value.skip >= 80) return
    let res = await fetchAttentionRank({
      limit: requestData.value.limit,
      skip: requestData.value.skip
    })
    if (res.data.length === 0) {
      requestData.value.hasMore = false
      return
    }
    attentionRankList.value = [...attentionRankList.value, ...res.data]
  }
  getAttentionRankList()

  return {
    attentionRankList,
    getAttentionRankList
  }
}