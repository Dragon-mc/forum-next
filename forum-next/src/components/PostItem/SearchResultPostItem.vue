<script setup lang="ts">
import type { SearchResultPostItem as SearchResultPostItemType } from '@/types/post'
import { View, ChatDotRound } from '@element-plus/icons'
import { emphasizeKeywords } from '@/utils'
import { RouteName } from '@/enum/route'

interface Props {
  resultItem: SearchResultPostItemType
  emphasized: string
}
defineProps<Props>()
</script>

<template>
  <li>
    <div class="post_item">
      <div class="title">
        <h2>
          <router-link
            :to="{
              name: RouteName.POST_NAME,
              params: { postId: resultItem.id, username: resultItem.username },
            }"
            v-html="emphasizeKeywords(resultItem.title, emphasized)"
          ></router-link>
        </h2>
      </div>
      <div class="summary_content">
        {{ resultItem.plain }}
      </div>
      <div class="list_user_bar">
        <router-link
          :to="{
            name: RouteName.USER_CENTER_NAME,
            params: { username: resultItem.username },
          }"
          class="user"
        >
          <img v-src="resultItem.avatar" />
          <div class="name">
            {{ resultItem.nickname || resultItem.username }}
          </div>
        </router-link>
        <div class="interactive">
          <div class="read_num">
            <router-link
              :to="{
                name: RouteName.POST_NAME,
                params: {
                  postId: resultItem.id,
                  username: resultItem.username,
                },
              }"
              ><el-icon><View /></el-icon
              >{{ resultItem.read_times }}</router-link
            >
          </div>
          <div class="comment_num">
            <router-link
              :to="{
                name: RouteName.POST_NAME,
                params: {
                  postId: resultItem.id,
                  username: resultItem.username,
                },
              }"
              ><el-icon><ChatDotRound /></el-icon
              >{{ resultItem.comment_times }}</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </li>
</template>

<style lang="scss" scoped>
li {
  background: #fff;
  border-bottom: 1px solid #f4f4f4;
  // height: 120px;
  padding: 18px 24px 13px;
  .post_item {
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
          &:hover {
            color: #409eff;
          }
        }
      }
    }
    .summary_content {
      color: #8a8a8a;
      // white-space: nowrap;
      letter-spacing: 0;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      margin: 12px 0;
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
          object-fit: cover;
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
        .read_num {
          margin-right: 12px;
        }
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
}
li:first-child {
  border-radius: 12px 12px 0 0;
}
li:last-child {
  border-radius: 0 0 12px 12px;
}
</style>
