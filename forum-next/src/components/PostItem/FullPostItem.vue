<script setup lang="ts">
import { View, ChatDotRound } from '@element-plus/icons'
import type { HomePostItem } from '@/types/post'
import { RouteName } from '@/enum/route'

interface Props {
  postItem: HomePostItem
}
defineProps<Props>()
</script>

<template>
  <div class="list_content">
    <div class="title">
      <h2>
        <router-link
          :to="{
            name: RouteName.POST_NAME,
            params: { postId: postItem.id, username: postItem.username },
          }"
          >{{ postItem.title }}</router-link
        >
      </h2>
    </div>
    <div class="summary_content">
      {{ postItem.plain }}
    </div>
    <div class="list_user_bar">
      <router-link
        :to="{
          name: RouteName.USER_CENTER_NAME,
          params: { username: postItem.username },
        }"
        class="user"
      >
        <img v-src="postItem.avatar" />
        <div class="name">
          {{ postItem.nickname || postItem.username }}
        </div>
      </router-link>
      <div class="interactive">
        <div class="read_num">
          <router-link
            :to="{
              name: RouteName.POST_NAME,
              params: { postId: postItem.id, username: postItem.username },
            }"
          >
            <el-icon><View /></el-icon>
            {{ postItem.read_times }}</router-link
          >
        </div>
        <div class="comment_num">
          <router-link
            :to="{
              name: RouteName.POST_NAME,
              params: { postId: postItem.id, username: postItem.username },
            }"
            ><el-icon><ChatDotRound /></el-icon
            >{{ postItem.comment_times }}</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.list_content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .title {
    h2 {
      font-weight: bold;
      line-height: 24px;
      height: 24px;
      a {
        font-size: 18px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        display: block;
        &:link {
          color: #3d3d3d;
        }
        &:visited {
          color: #b8b8b8;
        }
        &:hover {
          color: #409eff;
        }
      }
    }
  }
  .summary_content {
    color: #8a8a8a;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .list_user_bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .user {
      display: flex;
      align-items: center;
      img {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        margin-right: 6px;
      }
      .name {
        color: #3d3d3d;
        font-size: 14px;
        line-height: 24px;
      }
    }
    .interactive {
      display: flex;
      i {
        font-size: 18px;
        margin-right: 3px;
        font-weight: bold;
        color: #6b6b6b;
      }
      a {
        display: flex;
        justify-content: center;
        align-items: center;
        &:hover {
          color: #409eff;
        }
      }
    }
  }
}
</style>
