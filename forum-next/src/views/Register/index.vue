<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElFormItemContext, ElMessage } from 'element-plus'
import { getVerifyCode } from '@/api/register'
import { register } from '@/api/user'
import { guid } from '@/utils'
import { RouteName } from '@/enum/route'
import { debounce } from '@/utils'
import {
  validateRegisteUsername,
  validateRegistePassword,
  validateRepassword,
} from '@/utils/validate/user'
import moment from 'moment'
import { DateFormat } from '@/enum'
import type { requestRegister } from '@/types/request/user'

const $router = useRouter()

const registerForm = ref<ElFormItemContext | null>(null)
const registerFormData = ref({
  username: '',
  password: '',
  rePassword: '',
  vcode: '',
  token: '',
})
const registerRules = {
  username: [
    {
      required: true,
      trigger: 'blur',
      validator: validateRegisteUsername(() => registerFormData.value.username),
    },
  ],
  password: [
    { required: true, trigger: 'blur', validator: validateRegistePassword },
  ],
  rePassword: [
    {
      required: true,
      trigger: 'blur',
      validator: validateRepassword(() => registerFormData.value.password),
    },
  ],
}

const passwordType = ref('password')
const loading = ref(false)
const verifyCodeSrc = ref('')
registerFormData.value.token = guid()

const reloadVerifyCode = async () => {
  let res = await getVerifyCode({ token: registerFormData.value.token })
  verifyCodeSrc.value = res.data
}
reloadVerifyCode()

const showPwd = () => {
  if (passwordType.value === 'password') {
    passwordType.value = ''
  } else {
    passwordType.value = 'password'
  }
}

const handleRegsiter = async () => {
  try {
    registerForm.value && await registerForm.value.validate('blur')
    loading.value = true
    const data: requestRegister = Object.assign(registerFormData.value, {
      create_time: moment().format(DateFormat.STANDER),
    })
    register(data)
      .then(() => {
        ElMessage.success({ message: '注册成功！' })
        setTimeout(() => {
          $router.replace({ name: RouteName.LOGIN_NAME })
        }, 1000)
      })
      .catch(() => {
        loading.value = false
      })
  } catch (e) {}
}

const handleUsernameChange = debounce(() => {
  ;(<any>registerForm.value).validateField('username', () => {})
}, 1000)
</script>

<template>
  <div class="register-container">
    <!-- <vue-particles
        color="#2d3a4b"
        :particleOpacity="0.7"
        :particlesNumber="60"
        shapeType="circle"
        :particleSize="4"
        linesColor="#2d3a4b"
        :linesWidth="1"
        :lineLinked="true"
        :lineOpacity="0.4"
        :linesDistance="150"
        :moveSpeed="2"
        :hoverEffect="true"
        hoverMode="grab"
        :clickEffect="false"
        clickMode="push"
        class="particle"
      >
      </vue-particles> -->
    <el-form
      ref="registerForm"
      :model="registerFormData"
      :rules="registerRules"
      class="register-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">欢迎注册</h3>
      </div>

      <el-form-item prop="username">
        <el-popover
          ref="popover"
          placement="top"
          width="400"
          trigger="focus"
          effect="dark"
          content="设置后不可更改，英文数字组合，最少6位最长16位"
        >
        </el-popover>
        <el-input
          ref="username"
          v-model="registerFormData.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
          @input="handleUsernameChange"
          v-popover:popover
        >
          <i slot="prefix" class="iconfont icon-user"></i>
        </el-input>
      </el-form-item>

      <el-form-item prop="password" class="input-wrap">
        <el-input
          :key="passwordType"
          ref="password"
          v-model="registerFormData.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          autocomplete="on"
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

      <el-form-item prop="rePassword" class="input-wrap">
        <el-input
          :key="passwordType"
          ref="rePassword"
          v-model="registerFormData.rePassword"
          :type="passwordType"
          placeholder="重复输入密码"
          name="rePassword"
          tabindex="2"
          autocomplete="on"
        >
          <i slot="prefix" class="iconfont icon-mima"></i>
          <el-tooltip
            slot="suffix"
            class="item"
            effect="dark"
            placement="top-end"
          >
            <div slot="content">
              长度为8~20个字符<br />可以是字母、数字、符号<br />不允许有空格、中文
            </div>
            <i class="el-icon-warning-outline"></i>
          </el-tooltip>
        </el-input>
      </el-form-item>

      <el-form-item class="input-wrap">
        <el-row :gutter="24">
          <el-col :span="16">
            <el-input
              :key="passwordType"
              v-model="registerFormData.vcode"
              placeholder="验证码"
              name="vcode"
              tabindex="2"
              autocomplete="on"
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
        @click.native.prevent="handleRegsiter"
        >注册</el-button
      >

      <div class="bottom_wrap">
        <div>已有账号？</div>
        <router-link :to="{ name: RouteName.LOGIN_NAME }">
          <el-button type="primary"> 登录 </el-button>
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
.register-container {
  min-height: 100vh;
  width: 100%;
  background: #f2f2f2;
  overflow: hidden;

  .register-form {
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
      margin: 0px auto 80px auto;
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

  .bottom_wrap {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .code_wrap {
    // background: #000;
    img {
      border-radius: 10px;
    }
  }
}
</style>
