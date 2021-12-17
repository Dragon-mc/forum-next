import { ElMessage } from 'element-plus'
import { collection, calcelCollection } from '@/api/user'
import { isLogin } from '@/utils/auth'
import moment from 'moment'
import { DateFormat } from '@/enum'

interface retType {
  collection: boolean
}

export default function () {
  const handleCollection = async (
    isCollection: boolean | undefined,
    postId: number | string | undefined,
    changeState: Function
  ) => {
    if (!isLogin()) {
      ElMessage.error({ message: '请登录后操作' })
      return
    }
    let message = ''
    const ret: retType = { collection: false }
    if (isCollection) {
      // 取消收藏
      await calcelCollection({
        post_id: postId || '',
      })
      message = '取消收藏'
    } else {
      // 收藏
      await collection({
        post_id: postId || '',
        time: moment().format(DateFormat.STANDER),
      })
      message = '收藏成功'
      ret.collection = true
    }
    changeState()
    ElMessage.success({ message })
    return ret
  }

  return {
    handleCollection
  }
}
