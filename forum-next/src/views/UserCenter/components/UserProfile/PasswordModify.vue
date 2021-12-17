<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElFormItemContext } from 'element-plus'
import { WarningFilled } from '@element-plus/icons'
import { modifyPassword } from '@/api/user'
import { validateRepassword } from '@/utils/validate/user'

interface Props {
  modifyPwdVisible: boolean
}
defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modifyPwdVisible', id: boolean): void
}>()

// 表单引用
const passwordForm = ref<ElFormItemContext | null>(null)
const passwordFormData = ref({
  password: '',
  newPassword: '',
  rePassword: '',
})
// 控制密码显示
const passwordType = ref(['password', 'password', 'password'])
const passwordError = ref(false)
const validatePassword = (rule: any, value: string, callback: Function) => {
  if (passwordError.value) {
    passwordError.value = false
    callback(new Error('原密码错误，请重新输入'))
  }
  let reg = /^[0-9A-z`~!@#$%^&*()_+-=\/\\\[\]\{\};':",.<>?]{8,20}$/
  if (value.length < 8 || value.length > 20) {
    callback(new Error('密码长度最少8位，不超过20位'))
  } else if (!reg.test(value)) {
    callback(new Error('密码只能使用英文、数字和特殊字符'))
  } else {
    callback()
  }
}
const passwordRules = {
  password: [{ required: true, trigger: 'blur', validator: validatePassword }],
  newPassword: [
    { required: true, trigger: 'blur', validator: validatePassword },
  ],
  rePassword: [
    { required: true, trigger: 'blur', validator: validateRepassword(() => passwordFormData.value.newPassword) },
  ],
}

const showPwd = (index: number) => {
  if (passwordType.value[index] === 'password') {
    passwordType.value[index] = ''
  } else {
    passwordType.value[index] = 'password'
  }
}

// 修改用户密码
const handleModifyPassword = async () => {
  try {
    await (<ElFormItemContext>passwordForm.value).validate('blur')
    const data = Object.assign({}, passwordFormData.value)
    const res = await modifyPassword(data)
    if (res.data.success) {
      ElMessage.success({ message: res.data.message })
      setTimeout(() => {
        emit('update:modifyPwdVisible', false)
      }, 500)
    } else {
      ElMessage.error({ message: res.data.message })
      passwordError.value = true
      ;(<any>passwordForm.value).validateField('password')
    }
  } catch (e) {
    ElMessage({
      showClose: true,
      message: '输入信息有误！',
      type: 'error',
    })
  }
}
</script>

<template>
  <el-dialog
    title="密码修改"
    v-model="modifyPwdVisible"
    width="30%"
    @close="$emit('update:modifyPwdVisible', false)"
  >
    <el-form
      class="password-form"
      ref="passwordForm"
      :model="passwordFormData"
      :rules="passwordRules"
    >
      <el-form-item prop="password" class="input-wrap">
        <el-input
          :key="passwordType[0]"
          v-model="passwordFormData.password"
          :type="passwordType[0]"
          placeholder="原密码"
          name="password"
          tabindex="2"
          autocomplete="on"
        >
          <template #prefix>
            <i class="iconfont icon-mima"></i>
          </template>
          <i
            class="show-pwd"
            @click="showPwd(0)"
            slot="suffix"
            :class="
              passwordType[0] === 'password'
                ? 'iconfont icon-eye-close'
                : 'iconfont icon-eye-open'
            "
          ></i>
        </el-input>
      </el-form-item>
      <el-form-item prop="newPassword" class="input-wrap">
        <el-input
          :key="passwordType[1]"
          v-model="passwordFormData.newPassword"
          :type="passwordType[1]"
          placeholder="新密码"
          name="password"
          tabindex="2"
          autocomplete="on"
        >
          <template #prefix>
            <i class="iconfont icon-mima"></i>
          </template>
          <i
            class="show-pwd"
            @click="showPwd(1)"
            slot="suffix"
            :class="
              passwordType[1] === 'password'
                ? 'iconfont icon-eye-close'
                : 'iconfont icon-eye-open'
            "
          ></i>
        </el-input>
      </el-form-item>
      <el-form-item prop="rePassword" class="input-wrap">
        <el-input
          :key="passwordType[2]"
          v-model="passwordFormData.rePassword"
          :type="passwordType[2]"
          placeholder="重复新密码"
          name="rePassword"
          tabindex="2"
          autocomplete="on"
        >
          <template #prefix>
            <i class="iconfont icon-mima"></i>
          </template>
          <template #suffix>
            <el-tooltip class="item" effect="dark" placement="top-end">
              <template #content>
                <div>
                  长度为8~20个字符<br />可以是字母、数字、符号<br />不允许有空格、中文
                </div>
              </template>
              <el-icon><WarningFilled /></el-icon>
            </el-tooltip>
          </template>
          <i
            class="show-pwd"
            @click="showPwd(2)"
            slot="suffix"
            :class="
              passwordType[2] === 'password'
                ? 'iconfont icon-eye-close'
                : 'iconfont icon-eye-open'
            "
          ></i>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('update:modifyPwdVisible', false)"
          >取 消</el-button
        >
        <el-button type="primary" @click="handleModifyPassword"
          >确 定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.password-form {
  padding: 0 100px;
  .show-pwd {
    cursor: pointer;
    margin-right: 5px;
    margin-left: 10px;
  }
}
</style>
