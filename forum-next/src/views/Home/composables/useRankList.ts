import { ref } from 'vue'
import type {
  BrowseRankItemType,
  CommentRankItemType,
  AttentionRankItemType,
} from '@/types/rank'
import { fetchRankList } from '@/api'

export default function () {
  const browseRank = ref<Array<BrowseRankItemType>>([])
  const commentRank = ref<Array<CommentRankItemType>>([])
  const attentionRank = ref<Array<AttentionRankItemType>>([])

  const getRankList = async () => {
    const res = await fetchRankList()
    browseRank.value = res.data.browse_rank
    commentRank.value = res.data.comment_rank
    attentionRank.value = res.data.attention_rank
  }
  getRankList()

  return {
    browseRank,
    commentRank,
    attentionRank,
    getRankList
  }
}

