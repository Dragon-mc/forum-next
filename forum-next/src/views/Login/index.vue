<script setup lang="ts">
import { ref, onMounted, nextTick, markRaw } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElFormItemContext } from 'element-plus'
import { setUserInfo, setToken, setRefreshToken } from '@/utils/auth'
import { getVerifyCode } from '@/api/register'
import { login } from '@/api/user'
import { guid, getFuncValue } from '@/utils/index'
import { validateUsername, validatePassword } from '@/utils/validate/user'
import { RouteName } from '@/enum/route'
import type { UserInfo } from '@/types/user'
import ThirdParty, { thirdPartyList } from '@/enum/thirdParty'
import type { oauthType } from '@/types/oauth'

const $router = useRouter()

const loginFormData = ref({
  username: '',
  password: '',
  vcode: '',
  token: '',
})
const loading = ref(false)
const username = ref<HTMLInputElement | null>(null)
const password = ref<HTMLInputElement | null>(null)
const loginForm = ref<ElFormItemContext>()
const loginRules = markRaw({
  username: [{ required: true, trigger: 'blur', validator: validateUsername }],
  password: [{ required: true, trigger: 'blur', validator: validatePassword }],
})
const loginSuccess = (token: string, info: UserInfo, refreshToken: string) => {
  setToken(token)
  setUserInfo(info)
  setRefreshToken(refreshToken)
  ElMessage.success('登录成功！')
  setTimeout(() => {
    $router.replace({ name: RouteName.HOME_NAME })
  }, 1000)
}

onMounted(async () => {
  if (loginFormData.value.username === '') {
    username.value && username.value.focus()
  } else if (loginFormData.value.password === '') {
    password.value && password.value.focus()
  }

  // 初始化时获取验证码
  loginFormData.value.token = guid()
  let res = await getVerifyCode({ token: loginFormData.value.token })
  verifyCodeSrc.value = res.data
})

const handleLogin = async () => {
  try {
    await (loginForm.value as ElFormItemContext).validate('blur')
    loading.value = true
    login(loginFormData.value)
      .then((res) => {
        // 将token存入cookie
        loginSuccess(res.data.token, res.data.info, res.data.refresh_token)
      })
      .finally(() => {
        loading.value = false
      })
  } catch (e) {}
}

// 密码显示
const passwordType = ref('password')
const showPwd = () => {
  passwordType.value = passwordType.value ? '' : 'password'
  nextTick(() => {
    ;(password.value as HTMLElement).focus()
  })
}

// 验证码
const verifyCodeSrc = ref('')
const reloadVerifyCode = async () => {
  let res = await getVerifyCode({ token: loginFormData.value.token })
  verifyCodeSrc.value = res.data
}

// 三方登录
const handleOauthLogin = (type: oauthType) => {
  const { url, params } = ThirdParty[type]
  let query = [],
    key: any
  for (key in params) {
    query.push(`${key}=${getFuncValue(params[key])}`)
  }
  window.location.href = `${url}?${query.join('&')}`
}
</script>

<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginFormData"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">用户登录</h3>
      </div>

      <el-form-item prop="username">
        <el-input
          ref="username"
          v-model="loginFormData.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        >
          <i slot="prefix" class="iconfont icon-user"></i>
        </el-input>
      </el-form-item>

      <el-form-item prop="password" class="input-wrap">
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginFormData.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          autocomplete="on"
          @keyup.enter="handleLogin"
        >
          <i slot="prefix" class="iconfont icon-mima"></i>
          <i
            class="show-pwd"
            @click="showPwd"
            slot="suffix"
            :class="
              passwordType === 'password'
                ? 'iconfont icon-eye-close'
                : 'iconfont icon-eye-open'
            "
          ></i>
        </el-input>
      </el-form-item>

      <el-form-item class="input-wrap">
        <el-row :gutter="24">
          <el-col :span="16">
            <el-input
              :key="passwordType"
              v-model="loginFormData.vcode"
              placeholder="验证码"
              name="vcode"
              tabindex="2"
              autocomplete="on"
              @keyup.enter="handleLogin"
            >
              <i slot="prefix" class="iconfont icon-verify"></i>
            </el-input>
          </el-col>
          <el-col :span="8" class="code_wrap">
            <el-image
              :src="'data:image/jpeg;base64,' + verifyCodeSrc"
              @click="reloadVerifyCode"
            >
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </el-col>
        </el-row>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.prevent="handleLogin"
        >登录</el-button
      >

      <div class="feat-wrap">
        <div class="third-party-wrap">
          <div
            v-for="item in thirdPartyList"
            :key="item.id"
            class="third-party-item"
          >
            <el-tooltip
              class="item"
              effect="dark"
              :content="item.name"
              placement="top"
            >
              <span
                class="iconfont"
                :class="[item.iconfont]"
                :style="{ color: item.color }"
                @click="handleOauthLogin(item.name)"
              ></span>
            </el-tooltip>
          </div>
        </div>
        <router-link :to="{ name: RouteName.REGISTER_NAME }">
          <el-button class="thirdparty-button" type="primary">
            注册账户
          </el-button>
        </router-link>
      </div>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
$dark_gray: #889aa4;
$light_gray: #eee;
.particle {
  position: absolute;
  width: 100vw;
  height: 100vh;
}
.login-container {
  min-height: 100vh;
  width: 100%;
  background: #f2f2f2;
  overflow: hidden;
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 200px 55px 0;
    margin: 0 auto;
    overflow: hidden;
    i {
      font-size: 16px;
    }
  }

  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: #333;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
  .show-pwd {
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .feat-wrap {
    display: flex;
    justify-content: space-between;
  }
  .third-party {
    &-wrap {
      display: flex;
    }
    &-item {
      display: flex;
      align-items: center;
      margin-right: 15px;
      .iconfont {
        font-size: 30px;
        cursor: pointer;
        opacity: 0.8;
        &:hover {
          opacity: 1;
        }
      }
    }
  }
}
</style>
