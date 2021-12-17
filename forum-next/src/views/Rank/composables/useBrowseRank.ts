import { ref, Ref } from 'vue'
import { fetchBrowseRank } from '@/api/index'
import type { requestModel } from '@/types/request'
import type { BrowseRankDetailItem } from '@/types/rank'

export default function (requestData: Ref<requestModel>) {
  const browseRankList = ref<Array<BrowseRankDetailItem>>([])
  const getBrowseRankList = async () => {
    if (requestData.value.skip >= 80) return
    let res = await fetchBrowseRank({
      limit: requestData.value.limit,
      skip: requestData.value.skip
    })
    if (res.data.length === 0) {
      requestData.value.hasMore = false
      return
    }
    browseRankList.value = [...browseRankList.value, ...res.data]
  }
  getBrowseRankList()

  return {
    browseRankList,
    getBrowseRankList
  }
}