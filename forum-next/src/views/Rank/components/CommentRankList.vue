<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { View, ChatDotRound } from '@element-plus/icons'
import useRequestModel from '@/hooks/useRequestModel'
import useRequestLoadMore from '@/hooks/useRequestLoadMore'
import useCommentRank from '../composables/useCommentRank'
import { fromNow } from '@/utils/computed'
import { bus } from '@/utils'
import { RouteName } from '@/enum/route'

const { requestData } = useRequestModel()
const { commentRankList, getCommentRankList } = useCommentRank(requestData)
const { handleLoadMore } = useRequestLoadMore(requestData, getCommentRankList)

onMounted(() => bus.on('scroll-to-bottom', handleLoadMore))
onBeforeUnmount(() => bus.off('scroll-to-bottom', handleLoadMore))
</script>

<template>
  <div class="comment_rank_wrap">
    <div class="comment_rank_list">
      <div
        class="for-item"
        v-for="(item, index) in commentRankList"
        :key="item.post_id"
      >
        <div class="number">
          {{ index + 1 }}
        </div>
        <div class="comment_rank_item">
          <div class="user_info">
            <div class="user_avatar">
              <router-link
                :to="{
                  name: RouteName.USER_CENTER_NAME,
                  params: { username: item.username },
                }"
              >
                <img v-src="item.avatar" />
              </router-link>
            </div>
            <div class="user_name">
              <router-link
                :to="{
                  name: RouteName.USER_CENTER_NAME,
                  params: { username: item.username },
                }"
                >{{ item.nickname || item.username }}</router-link
              >
            </div>
            <div class="collection_time">
              {{ fromNow(item.time) }}
            </div>
          </div>
          <el-row class="post_info">
            <el-col :span="20" class="info_left">
              <div class="post_title">
                <router-link
                  :to="{
                    name: RouteName.USER_CENTER_NAME,
                    params: { username: item.username },
                  }"
                  >{{ item.title }}</router-link
                >
              </div>
              <div class="post_content">
                {{ item.plain }}
              </div>
            </el-col>
            <el-col :span="4" class="info_right">
              <el-row :gutter="12">
                <el-col :sm="12" :md="12" :lg="12" :xl="12" class="read_num">
                  <router-link
                    :to="{
                      name: RouteName.POST_NAME,
                      params: { postId: item.post_id, username: item.username },
                    }"
                    ><el-icon><View /></el-icon
                    >{{ item.read_times }}</router-link
                  >
                </el-col>
                <el-col :sm="12" :md="12" :lg="12" :xl="12" class="comment_num">
                  <router-link
                    :to="{
                      name: RouteName.POST_NAME,
                      params: { postId: item.post_id, username: item.username },
                    }"
                    ><el-icon><ChatDotRound /></el-icon
                    >{{ item.commented_times }}</router-link
                  >
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.comment_rank_wrap {
  padding: 24px;
  .comment_rank_list {
    .for-item {
      display: flex;
      margin-top: 15px;
      &:nth-child(-n + 3) {
        .number {
          color: #fc5531;
        }
      }
      .number {
        padding-right: 40px;
        font-size: 28px;
        font-weight: bold;
      }
    }
    .comment_rank_item {
      width: calc(100% - 56px);
      padding: 18px;
      border: 1px solid #ededed;
      border-radius: 10px;
      &:hover {
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
      }
      .user_info {
        display: flex;
        align-items: center;
        margin-bottom: 6px;
        .user_avatar {
          img {
            width: 30px;
            height: 30px;
            object-fit: cover;
            border-radius: 50%;
          }
        }
        .user_name {
          font-weight: bold;
          padding-left: 20px;
          width: calc(100% - 120px);
          a {
            width: 100%;
            display: inline-block;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
        .collection_time {
          flex: 1;
          text-align: right;
        }
      }
      .post_info {
        .info_left {
          .post_title {
            margin-bottom: 10px;
            a {
              display: inline-block;
              width: 100%;
              font-size: 18px;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              font-weight: bold;
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
          .post_content {
            color: #8a8a8a;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .info_right {
          height: 53px;
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          align-items: flex-end;
          i {
            font-size: 18px;
            margin-right: 3px;
            font-weight: bold;
            color: #6b6b6b;
          }
          a {
            display: flex;
            justify-content: flex-end;
            align-items: flex-end;
            &:hover {
              color: #409eff;
            }
          }
        }
      }
    }
  }
}
</style>
