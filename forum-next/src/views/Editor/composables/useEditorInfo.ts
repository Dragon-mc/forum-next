import { ref, Ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import useCateList from '@/hooks/useCateList'
import { back } from '@/utils'

export default function (
  content: Ref<string>,
  title: Ref<string>,
  subId: Ref<Array<string | number> | null>
) {
  const isSave = ref(true)
  const propsOption = {
    expandTrigger: 'hover',
    value: 'id',
    label: 'name',
    children: 'sub_cate',
  }

  // 保存检测
  const saveDetection = () => {
    if (!isSave.value) {
      ElMessageBox.confirm('你所做的更改可能未保存！确定离开吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // 确定
          back()
        })
        .catch(() => {})
    }
    return isSave.value
  }

  // 点击返回按钮
  const handleReturnClick = () => {
    // 返回到上一个页面
    if (saveDetection()) back()
  }

  const handleCascaderChange = () => {
    isSave.value = false
  }

  // 检查数据
  const checkValid = () => {
    // 判断标题和内容是否为空
    if (title.value.trim() === '') {
      ElMessage.error({ message: '标题不能为空！' })
      return false
    } else if (content.value.trim() === '') {
      ElMessage.error({ message: '帖子内容不能为空！' })
      return false
    } else if (!subId.value || !subId.value[1]) {
      ElMessage.error({ message: '请选择帖子分类！' })
      return false
    }
    return true
  }

  return {
    propsOption,
    isSave,
    checkValid,
    handleReturnClick,
    handleCascaderChange,
    ...useCateList(),
  }
}
