import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { getUserCenterInfo } from '@/api/userCenter'
import type { UserCenterInfo as UserCenterInfoType } from '@/types/user'

export default function () {
  const userInfo = ref<UserCenterInfoType>({})
  const $route = useRoute()
  const getUserInfo = async () => {
    let res = await getUserCenterInfo({
      username: <string>$route.params.username || '',
    })
    userInfo.value = res.data
    return userInfo.value
  }
  const userInfoPromise = getUserInfo()

  return {
    userInfo,
    userInfoPromise,
    getUserCenterInfo: getUserInfo,
  }
}
