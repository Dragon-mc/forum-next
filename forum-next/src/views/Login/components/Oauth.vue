<script setup lang="ts">
import { RouteLocationRaw, useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { setToken, setUserInfo, setRefreshToken, getUserInfo } from '@/utils/auth'
import { oauthLogin, oauthBind } from '@/api/oauth'
import { RouteName } from '@/enum/route'
import { thirdPartyMap } from '@/enum/thirdParty'
import type { oauthType } from '@/types/oauth'

const $router = useRouter()
const $route = useRoute()

// 第三方登录
const code = <string>$route.query.code
const bind = <string>$route.query.type || ''
const type = $route.params.type as oauthType

const checkOauthLogin = async () => {
  if (typeof code !== 'undefined' && thirdPartyMap[type]) {
    let redirect: RouteLocationRaw
    try {
      if (bind === 'bind') {
        const userInfo = getUserInfo()
        redirect = {
          name: RouteName.USER_PROFILE_NAME,
          params: { username: userInfo.username },
        }
        // 三方绑定
        const res = await oauthBind({
          code: code,
          type,
        })
        ElMessage.success(`绑定${type}成功!`)
        setTimeout(() => {
          $router.replace(redirect)
        }, 1000)
      } else {
        redirect = { name: RouteName.HOME_NAME }
        const res = await oauthLogin({
          code: code,
          type,
        })
        // 三方登录
        setToken(res.data.token)
        setUserInfo(res.data.info)
        setRefreshToken(res.data.refresh_token)
        ElMessage.success('登录成功！')
        setTimeout(() => {
          $router.replace(redirect)
        }, 1000)
      }
    } catch (e: any) {
      // 认证失败
      setTimeout(() => {
        $router.replace(redirect)
      }, 1000)
    }
  } else {
    // code不存在或者认证类型非法
    ElMessage.error('认证非法！')
    setTimeout(() => {
      $router.go(-1)
    }, 1000)
  }
}
checkOauthLogin()
</script>

<template>
  <div class="oauth-wrap">
    <div class="text-loading">授权中</div>
    <ul class="strip-loading">
      <li v-for="item in 8" :style="[`--line-index: ${item}`]"></li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.oauth-wrap {
  height: 100vh;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  .text-loading {
    margin-bottom: 50px;
    font-size: 30px;
    font-weight: bold;
    color: #33cc99;
  }
}
.strip-loading {
  display: flex;
  justify-content: center;
  align-items: center;
}

.strip-loading li {
  --time: calc((var(--line-index) - 1) * 200ms);
  border-radius: 3px;
  width: 15px;
  height: 100px;
  background-color: #33cc99;
  animation: beat 1.5s ease-in-out var(--time) infinite;
  list-style-type: none;
}

li + li {
  margin-left: 5px;
}

@keyframes beat {
  0%,
  100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.5);
  }
}
</style>
