import { ElMessage } from 'element-plus'
import { attention, cancelAttention } from '@/api/user'
import { isLogin } from '@/utils/auth'
import moment from 'moment'
import { DateFormat } from '@/enum'

interface retType {
  attention: boolean
}

export default function () {
  const handleAttention = async (
    isAttention: boolean | undefined,
    passiveId: number | string | undefined,
    changeState: Function
  ) => {
    // 检查是否登录
    if (!isLogin()) {
      ElMessage.error({ message: '请登录后操作' })
      return
    }
    const ret: retType = { attention: false }
    let message = ''
    if (isAttention) {
      // 取消关注
      await cancelAttention({
        passive_id: passiveId || '',
      })
      message = '取消关注'
    } else {
      // 关注
      await attention({
        passive_id: passiveId || '',
        time: moment().format(DateFormat.STANDER),
      })
      message = '关注成功'
      ret.attention = true
    }
    changeState()
    ElMessage.success({ message })
    return ret
  }

  return {
    handleAttention,
  }
}
