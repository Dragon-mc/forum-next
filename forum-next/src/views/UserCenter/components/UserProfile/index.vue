<script setup lang="ts">
import { ref, ComputedRef } from 'vue'
import { ElMessage } from 'element-plus'
import type { UserCenterInfo as UserCenterInfoType } from '@/types/user'
import ProfileDisplay from './ProfileDisplay.vue'
import ProfileModify from './ProfileModify.vue'
import PasswordModify from './PasswordModify.vue'
import { modifyProfile } from '@/api/userCenter'
interface Props {
  userInfo: UserCenterInfoType
  profilePrefix: ComputedRef<string>
}
defineProps<Props>()
const modifyProfileVisible = ref(false)
const modifyPwdVisible = ref(false)

const handleSaveProfile = async (userInfo: UserCenterInfoType) => {
  modifyProfileVisible.value = false
  const data = Object.assign({}, userInfo)
  delete data['avatar']
  await modifyProfile(data)
  ElMessage({
    message: '信息修改成功',
    type: 'success',
  })
}
</script>

<template>
  <div class="profile_wrap">
    <div class="title">
      <span>{{ profilePrefix }}信息</span>
      <template v-if="userInfo.self">
        <div class="modify-wrap" v-if="!modifyProfileVisible">
          <div class="modify modify-pwd" @click="modifyPwdVisible = true">
            修改密码
          </div>
          <div class="modify modify-info" @click="modifyProfileVisible = true">
            修改信息
          </div>
        </div>
        <div class="save-cancel" v-else>
          <div class="btn save" @click="handleSaveProfile(userInfo)">保存</div>
          <div class="btn cancel" @click="modifyProfileVisible = false">
            取消
          </div>
        </div>
      </template>
    </div>
    <ProfileDisplay :user-info="userInfo" v-if="!modifyProfileVisible" />
    <!-- 信息修改框 -->
    <ProfileModify :user-info="userInfo" v-else />
    <!-- 密码修改框 -->
    <PasswordModify v-model:modifyPwdVisible="modifyPwdVisible" />
  </div>
</template>

<style lang="scss" scoped>
.profile_wrap {
  padding: 24px;
  .title {
    span {
      font-size: 16px;
    }
    color: #222226;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .modify-wrap {
      display: flex;
      .modify {
        height: 26px;
        width: 90px;
        text-align: center;
        line-height: 26px;
        border-radius: 13px;
        font-weight: normal;
      }
      .modify-pwd {
        border: 1px solid #e6a23c;
        color: #e6a23c;
        margin-right: 15px;
        &:hover {
          background: rgba(230, 162, 60, 0.1);
          cursor: pointer;
        }
      }
      .modify-info {
        border: 1px solid #409eff;
        color: #409eff;
        &:hover {
          background: rgba(16, 142, 233, 0.1);
          cursor: pointer;
        }
      }
    }
    .save-cancel {
      display: flex;
      .btn {
        width: 62px;
        height: 26px;
        line-height: 26px;
        text-align: center;
        border-radius: 13px;
        color: #fff;
        font-weight: normal;
        &:hover {
          opacity: 0.9;
          cursor: pointer;
        }
      }
      .save {
        background: #409eff;
        margin-right: 15px;
      }
      .cancel {
        background: #f56c6c;
      }
    }
  }
}
</style>
