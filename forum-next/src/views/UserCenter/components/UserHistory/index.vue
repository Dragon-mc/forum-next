<script setup lang="ts">
import { ref } from 'vue'
import { View, ChatDotRound } from '@element-plus/icons'
import type { UserCenterInfo, UserHistoryItem } from '@/types/user'
import usePaginationModel from '@/hooks/usePaginationModel'
import { fromNow } from '@/utils/computed'
import { fetchHistory } from '@/api/userCenter'
import { RouteName } from '@/enum/route'
import type { requestFetchHistory } from '@/types/request/userCenter'

interface Props {
  userInfoPromise: Promise<UserCenterInfo>
}
const { userInfoPromise } = defineProps<Props>()

const { paginationData, total, loading, handlePageChange } =
  usePaginationModel()

const historyList = ref<Array<UserHistoryItem>>([])
// 获取历史列表
const getHistoryList = async () => {
  loading.value = true
  const data: requestFetchHistory = Object.assign(paginationData.value, {
    id: (await userInfoPromise).id || '',
  })
  let res = await fetchHistory(data)
  historyList.value = res.data.items
  total.value = res.data.total
  loading.value = false
}
getHistoryList()
</script>

<template>
  <div class="collection_wrap">
    <div class="title">历史记录</div>
    <div
      class="history_list"
      v-loading="loading"
      v-if="loading || historyList.length"
    >
      <div class="history_item" v-for="item in historyList" :key="item.id">
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
            {{ fromNow(item.history_time) }}
          </div>
        </div>
        <el-row class="post_info">
          <el-col :span="20" class="info_left">
            <div class="post_title">
              <router-link
                :to="{
                  name: RouteName.POST_NAME,
                  params: { postId: item.id, username: item.username },
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
                    params: { postId: item.id, username: item.username },
                  }"
                  ><el-icon><View /></el-icon>{{ item.read_times }}</router-link
                >
              </el-col>
              <el-col :sm="12" :md="12" :lg="12" :xl="12" class="comment_num">
                <router-link
                  :to="{
                    name: RouteName.POST_NAME,
                    params: { postId: item.id, username: item.username },
                  }"
                  ><el-icon><ChatDotRound /></el-icon
                  >{{ item.comment_times }}</router-link
                >
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <div class="pagination" v-if="total > paginationData.limit">
        <el-pagination
          @current-change="handlePageChange($event, getHistoryList)"
          :current-page="paginationData.page"
          :page-size="paginationData.limit"
          layout="total, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <div class="no-data" v-else>
      <img src="@/assets/no-data.png" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.collection_wrap {
  padding: 24px;
  .title {
    font-size: 16px;
    color: #222226;
    font-weight: bold;
  }
  .history_list {
    min-height: 150px;
    .history_item {
      margin-top: 15px;
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
              font-size: 18px;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              font-weight: bold;
              display: inline-block;
              width: 100%;
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

    .pagination {
      .el-pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 15px;
      }
    }
  }
  .no-data {
    display: flex;
    justify-content: center;
    img {
      width: 30%;
    }
  }
}
</style>
