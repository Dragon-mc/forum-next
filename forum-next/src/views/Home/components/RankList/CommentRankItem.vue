<script setup lang="ts">
import type { CommentRankItemType } from '@/types/rank'
import { RouteName } from '@/enum/route'

interface Props {
  rankItem: CommentRankItemType
}
defineProps<Props>()
</script>

<template>
  <el-col class="comment_item" :xs="12" :sm="12" :md="24" :lg="24" :xl="24">
    <router-link
      :to="{
        name: RouteName.POST_NAME,
        params: {
          postId: rankItem.post_id,
          username: rankItem.details.username,
        },
      }"
    >
      <div class="user">
        <img
          v-src="rankItem.details.avatar"
          alt=""
        />
        <div class="user_info">
          <div class="name">
            {{ rankItem.details.nickname || rankItem.details.username }}
          </div>
          <div class="sign">
            {{ rankItem.details.sign || '这个人太懒了，什么都没留下' }}
          </div>
        </div>
        <div class="msg_num">
          <i class="el-icon-chat-dot-round"></i>
          <div>{{ rankItem.commented_times }}</div>
        </div>
      </div>
      <div class="title">
        {{ rankItem.details.title }}
      </div>
    </router-link>
  </el-col>
</template>

<style lang="scss" scoped>
.comment_item {
  // height: 95px;
  padding: 8px;
  margin-bottom: 8px;
  border-bottom: 1px solid #f4f4f4;
  a {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .user {
      display: flex;
      img {
        width: 50px;
        object-fit: cover;
        border-radius: 50%;
        // width: 100%;
        height: 50px;
      }
      .user_info {
        padding-left: 12px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        width: calc(100% - 95px);
        .name {
          color: #4f4f4f;
          font-weight: bold;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .sign {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 12px;
          color: #707070;
        }
      }
      .msg_num {
        width: 45px;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        // width: 50px;
        i {
          font-size: 18px;
        }
      }
    }
    .title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 16px;
      padding: 5px 0;
      font-weight: bold;
      color: #3d3d3d;
    }
  }
}
</style>
