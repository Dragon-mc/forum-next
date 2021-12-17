import { ref, Ref } from 'vue'
import { ElMessage } from 'element-plus'
import { uploadAvatar } from '@/api/userCenter'
import { getUserInfo, setUserInfo } from '@/utils/auth'
import type { UserCenterInfo } from '@/types/user'
import { checkImg } from '@/utils/validate/image'
import { bus } from '@/utils'

export default function (userInfo: Ref<UserCenterInfo>) {
  const fileList = ref([])
  const showUpload = ref(false)
  const avatarUploaderVisible = ref(false)
  const uploader = ref<any>(null)

  const fileReset = () => {
    fileList.value = []
    uploader.value.uploadFiles = []
  }
  const handleUploaderStateChange = (file: any) => {
    if (file.status === 'ready') {
      // 选择了文件
      let fileInfo = file.raw
      // 判断图片大小是否小于2M
      if (fileInfo.size / 1024 / 1024 > 2) {
        ElMessage.warning({ message: '上传图片大小不能超过 2MB!' })
        fileReset()
        return
      } else if (fileInfo.type.indexOf('image') === -1) {
        // 判断选择的是否为图片
        ElMessage.warning({ message: '请选择图片资源!' })
        fileReset()
        return
      }

      // 检查文件大小
      checkImg(file.url, 150, 150)
        .then(() => {
          showUpload.value = true
        })
        .catch(() => {
          ElMessage.warning({ message: '图片宽度*高度至少为150*150像素!' })
          fileReset()
        })
    }
  }

  // 将头像上传至服务器并修改用户头像
  const handleRequestUpload = async (param: any) => {
    // let fileUrl = this.$refs.upload.uploadFiles[0].url
    const file = param.file
    const forms = new FormData()
    forms.append('file', file)
    forms.append('avatar', <string>userInfo.value.avatar)
    
    // 发送请求，上传用户头像
    let res
    try {
      res = await uploadAvatar(forms)
    } catch (e) {
      // 头像修改失败，将上传框关闭显示
      avatarUploaderVisible.value = false
      return
    }

    // 请求并返回成功数据后...
    let url = res.data.url
    let myUserInfo = getUserInfo()
    myUserInfo.avatar = url
    // 修改用户信息中的用户头像
    setUserInfo(myUserInfo)
    // 通知头部组件进行头像刷新
    bus.emit('user-info-update')
    // 修改当前页面用户的头像
    userInfo.value.avatar = url
    avatarUploaderVisible.value = false
    ElMessage({
      message: '修改头像成功',
      type: 'success',
    })
  }

  // 头像上传对话框打开
  const handleDialogOpen = () => {
    // 清空图片上传中所有的数据
    fileList.value = []
    if (uploader.value) uploader.value.uploadFiles = []
    showUpload.value = false
  }

  return {
    avatarUploaderVisible,
    fileList,
    showUpload,
    uploader,
    handleUploaderStateChange,
    handleRequestUpload,
    handleDialogOpen,
  }
}