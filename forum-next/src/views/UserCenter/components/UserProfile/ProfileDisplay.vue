<script setup lang="ts">
import { toRef } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UserCenterInfo } from '@/types/user'
import ThirdParty, { thirdPartyList } from '@/enum/thirdParty'
import { getFuncValue } from '@/utils'
import { oauthUnbind } from '@/api/oauth'
import type { oauthType } from '@/types/oauth'

interface Props {
  userInfo: UserCenterInfo
}
const props = defineProps<Props>()
const userInfo = toRef(props, 'userInfo')

const handleAuth = (name: oauthType, thirdParty: UserCenterInfo['third_party']) => {
  const hasBind = thirdParty && thirdParty[name]
  if (hasBind) {
    // 解绑
    ElMessageBox.confirm(`你确定要解绑${name}?`, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      await oauthUnbind({ type: name })
      ElMessage.success(`解绑${name}成功`)
      thirdParty[name] = false
    }).catch(() => {})
  } else {
    const { url, params } = ThirdParty[name]
    let query = [], key
    const requestParams = Object.assign({}, params)
    requestParams['redirect_uri'] += `?type=bind`
    for (key in requestParams) {
      query.push(`${key}=${getFuncValue(requestParams[key])}`)
    }
    window.location.href = `${url}?${query.join('&')}`
  }
}
</script>

<template>
  <div class="profile_content">
    <div class="msg_item">
      <div class="msg_key">用户名</div>
      <div class="msg_val">{{ userInfo.username }}</div>
    </div>
    <div class="msg_item">
      <div class="msg_key">昵称</div>
      <div class="msg_val">{{ userInfo.nickname }}</div>
    </div>
    <div class="msg_item">
      <div class="msg_key">签名</div>
      <div class="msg_val">
        {{ userInfo.sign || '这个人很懒，什么都没留下' }}
      </div>
    </div>
    <div class="msg_item">
      <div class="msg_key">简介</div>
      <div class="msg_val">{{ userInfo.introduction }}</div>
    </div>
    <div class="msg_item">
      <div class="msg_key">性别</div>
      <div class="msg_val">{{ userInfo.sex }}</div>
    </div>
    <div class="msg_item" v-if="userInfo.self">
      <div class="msg_key">第三方</div>
      <div class="msg_val">
        <div class="third-wrap">
          <div
            v-for="item in thirdPartyList"
            :key="item.id"
            class="third-item"
            @click="handleAuth(item.name as oauthType, userInfo.third_party)"
          >
            <span
              class="iconfont"
              :class="[item.iconfont]"
              :style="{ color: item.color }"
            ></span>
            {{
              userInfo.third_party && userInfo.third_party[item.name]
                ? '解绑'
                : '绑定'
            }}{{ item.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.profile_content {
  .msg_item {
    width: 100%;
    display: flex;
    margin: 20px 0;
    color: #555666;
    font-size: 14px;
    line-height: 24px;
    font-weight: 400;
    .msg_key {
      width: 64px;
      text-align: right;
      float: left;
      word-break: break-all;
    }
    .msg_val {
      flex: 1;
      padding-left: 16px;
      word-break: break-all;
    }
    .third-wrap {
      display: flex;
      .third-item {
        margin-right: 25px;
        cursor: pointer;
        &:hover {
          .iconfont {
            opacity: 1;
          }
        }
        .iconfont {
          opacity: 0.6;
        }
      }
    }
  }
}
</style>
