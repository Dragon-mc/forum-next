import { Ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { PostInfo } from '@/types/post'
import { PostState } from '@/enum/post'
import { back } from '@/utils'
import { EditorToType, EditorRoute } from '@/enum/route'

export default function (
  isEdit: Ref<boolean>,
  isSave: Ref<boolean>,
  curPostInfo: Ref<PostInfo | null>,
  postid: string,
  checkValid: Function,
  editCurrentPost: Function,
  publishCurrentPost: Function,
  type: EditorRoute
) {

  const handleSaveDraft = async () => {
    if (isEdit.value) {
      // 如果当前是编辑的内容，修改帖子信息即可
      await editCurrentPost(postid as string, PostState.DRAFT)
    } else {
      // 否则为发布帖子
      await publishCurrentPost(EditorToType[type], PostState.DRAFT)
    }
    ElMessage.success({ message: '保存草稿成功' })
    isSave.value = true
    // 如果不是在编辑情况下保存，则直接返回
    if (!isEdit.value) {
      setTimeout(back, 500)
    }
  }

  // 发布
  const handlePublish = async () => {
    // 检查数据
    if (!checkValid()) return
    if (isEdit.value && curPostInfo.value?.status === PostState.DRAFT) {
      // 编辑
      await editCurrentPost(postid as string, PostState.PUBLISHED)
    } else {
      // 发布
      await publishCurrentPost(EditorToType[type], PostState.PUBLISHED)
    }
    ElMessage.success({ message: '发布成功' })
    setTimeout(back, 500)
  }

  // 保存编辑
  const handleSaveEdit = async () => {
    // 检查数据
    if (!checkValid()) return
    await editCurrentPost(postid as string, PostState.PUBLISHED, true)
    ElMessage.success({ message: '编辑成功' })
    isSave.value = true
  }

  return {
    handleSaveDraft,
    handlePublish,
    handleSaveEdit,
  }
}
