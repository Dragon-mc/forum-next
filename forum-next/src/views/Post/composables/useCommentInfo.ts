import { ref, Ref } from 'vue'
import { fetchCommentInfo } from '@/api/post'
import type { paginationModel } from '@/types/request/index'
import type { PostCommentItem } from '@/types/post'
import type { requestCommentInfo } from '@/types/request/post'

export default function (
  postId: number | string,
  paginationData: Ref<paginationModel>,
  total: Ref<number>
) {
  const commentInfo = ref<Array<PostCommentItem>>([])
  const commentContent = ref('')
  const commentPlaceholder = ref('请输入评论内容')
  // 是否为回复状态，false表示当前是评论帖子的状态
  const isReply = ref(false)

  const getCommentInfo = async () => {
    const data: requestCommentInfo = Object.assign({ post_id: postId }, paginationData.value)
    let res = await fetchCommentInfo(data)
    commentInfo.value = res.data.items
    total.value = res.data.total
  }
  getCommentInfo()

  // 重置状态为非评论状态
  const restCommentState = () => {
    commentPlaceholder.value = '请输入评论内容'
    // 失焦则将状态恢复成默认状态 即评论状态
    isReply.value = false
  }

  return {
    commentInfo,
    commentContent,
    commentPlaceholder,
    isReply,
    getCommentInfo,
    restCommentState
  }
}
