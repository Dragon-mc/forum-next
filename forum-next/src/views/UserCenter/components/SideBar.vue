<script setup lang="ts">
import { ComputedRef } from 'vue'
import { RouteName } from '@/enum/route'
import type { UserCenterInfo } from '@/types/user'

interface Props {
  userInfo: UserCenterInfo
  profilePrefix: ComputedRef
  infoPrefix: ComputedRef
}
defineProps<Props>()
</script>

<template>
  <ul class="nav">
    <li>
      <router-link
        :to="{
          name: RouteName.USER_PROFILE_NAME,
          params: { username: userInfo.username || '0' },
        }"
        >{{ profilePrefix }}资料</router-link
      >
    </li>
    <li>
      <router-link
        :to="{
          name: RouteName.USER_COLLECTION_NAME,
          params: { username: userInfo.username || '0' },
        }"
        >{{ infoPrefix }}收藏的</router-link
      >
    </li>
    <li>
      <router-link
        :to="{
          name: RouteName.USER_PUBLISH_NAME,
          params: { username: userInfo.username || '0' },
        }"
        >{{ infoPrefix }}发布的</router-link
      >
    </li>
    <li v-if="userInfo.self">
      <router-link
        :to="{
          name: RouteName.USER_DRAFT_NAME,
          params: { username: userInfo.username || '0' },
        }"
        >待发布</router-link
      >
    </li>
    <li>
      <router-link
        :to="{
          name: RouteName.USER_ATTENTION_NAME,
          params: { username: userInfo.username || '0' },
        }"
        >{{ infoPrefix }}关注的</router-link
      >
    </li>
    <li>
      <router-link
        :to="{
          name: RouteName.USER_FANS_NAME,
          params: { username: userInfo.username || '0' },
        }"
        >{{ infoPrefix }}的粉丝</router-link
      >
    </li>
    <li>
      <router-link
        :to="{
          name: RouteName.USER_HISTORY_NAME,
          params: { username: userInfo.username || '0' },
        }"
        >浏览历史</router-link
      >
    </li>
    <li v-if="userInfo.self">
      <router-link
        :to="{
          name: RouteName.USER_FEEDBACK_NAME,
          params: { username: userInfo.username || '0' },
        }"
        >意见反馈</router-link
      >
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.nav {
  background: #fff;
  border-radius: 12px;
  padding: 16px 0;
  li {
    margin-bottom: 16px;
    a {
      display: flex;
      margin: 0 16px;
      height: 100%;
      justify-content: center;
      align-items: center;
      padding: 8px 0;
      &:hover {
        background: rgb(245, 246, 247);
        border-radius: 17.5px;
        color: #409eff;
      }
    }
    .router-link-active {
      background: rgb(245, 246, 247);
      border-radius: 17.5px;
    }
  }
}
</style>
