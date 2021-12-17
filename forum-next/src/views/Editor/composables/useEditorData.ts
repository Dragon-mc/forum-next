import { ref } from 'vue'
import { postEdit, postPublish } from '@/api/post'
import moment from 'moment'
import { DateFormat } from '@/enum'
import type { PostInfo } from '@/types/post'
import type { requestPostEdit } from '@/types/request/post'

export default function () {
  // 编辑器内容
  const content = ref('')
  const plain = ref('')
  const title = ref('')
  const subId = ref<Array<string | number> | null>(null)
  const isEdit = ref(false)
  const curPostInfo = ref<PostInfo | null>(null)

  const editCurrentPost = async (
    postid: number | string,
    status: number,
    saveEdit: boolean = false
  ) => {
    const data: requestPostEdit = {
      title: title.value,
      content: content.value,
      plain: plain.value,
      sub_id: subId.value ? subId.value[1] : 0,
      id: postid,
    }
    if (!saveEdit) {
      Object.assign(data, {
        time: moment().format(DateFormat.STANDER),
        status,
      })
    }
    await postEdit(data)
  }

  const publishCurrentPost = async (type: 1 | 2, status: number) => {
    await postPublish({
      title: title.value,
      content: content.value,
      plain: plain.value,
      type,
      time: moment().format(DateFormat.STANDER),
      sub_id: subId.value ? subId.value[1] : 0,
      status,
    })
  }

  return {
    content,
    plain,
    title,
    subId,
    isEdit,
    curPostInfo,
    editCurrentPost,
    publishCurrentPost,
  }
}
