<script setup lang="ts">
import type { UserCenterInfo } from '@/types/user'
interface Props {
  userInfo: UserCenterInfo
}
defineProps<Props>()
</script>

<template>
  <div class="modify_form">
    <div class="msg_item">
      <div class="msg_key">昵称</div>
      <div class="msg_val">
        <el-input
          auto-complete="off"
          v-model="userInfo.nickname"
          placeholder="请输入昵称"
        ></el-input>
      </div>
    </div>
    <div class="msg_item">
      <div class="msg_key">签名</div>
      <div class="msg_val">
        <el-input
          auto-complete="off"
          v-model="userInfo.sign"
          maxlength="50"
          show-word-limit
          placeholder="请输入签名"
        ></el-input>
      </div>
    </div>
    <div class="msg_item">
      <div class="msg_key introduction">简介</div>
      <div class="msg_val">
        <el-input
          auto-complete="off"
          v-model="userInfo.introduction"
          type="textarea"
          maxlength="300"
          rows="5"
          :autosize="{ minRows: 5, maxRows: 10 }"
          show-word-limit
          placeholder="请输入简介"
        ></el-input>
      </div>
    </div>
    <div class="msg_item">
      <div class="msg_key">性别</div>
      <div class="msg_val">
        <el-radio v-model="userInfo.sex" label="男">男</el-radio>
        <el-radio v-model="userInfo.sex" label="女">女</el-radio>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modify_form {
  max-width: 850px;
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
      float: left;
      word-break: break-all;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
    .msg_val {
      flex: 1;
      padding-left: 16px;
      word-break: break-all;
    }
    .introduction {
      align-items: flex-start;
    }
  }
}
</style>
