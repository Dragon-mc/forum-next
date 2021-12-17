<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue-demi'
import { View } from '@element-plus/icons'
import useBrowseRank from '../composables/useBrowseRank'
import useRequestModel from '@/hooks/useRequestModel'
import useRequestLoadMore from '@/hooks/useRequestLoadMore'
import { bus } from '@/utils'
import { RouteName } from '@/enum/route'

const { requestData } = useRequestModel()
const { browseRankList, getBrowseRankList } = useBrowseRank(requestData)
const { handleLoadMore } = useRequestLoadMore(requestData, getBrowseRankList)

onMounted(() => bus.on('scroll-to-bottom', handleLoadMore))
onBeforeUnmount(() => bus.off('scroll-to-bottom', handleLoadMore))
</script>

<template>
  <div class="browse_rank_wrap">
    <div class="rank_list">
      <div
        class="rank_item"
        v-for="(item, index) in browseRankList"
        :key="item.post_id"
      >
        <div class="number">
          {{ index + 1 }}
        </div>
        <div class="info">
          <div class="title">
            <router-link
              :to="{
                name: RouteName.POST_NAME,
                params: { postId: item.post_id, username: item.username },
              }"
              >{{ item.title }}</router-link
            >
          </div>
          <div class="detail">
            <div class="read_times">
              <el-icon><View /></el-icon>{{ item.read_times }}
            </div>
            <div class="user_info">
              <router-link
                :to="{
                  name: RouteName.USER_CENTER_NAME,
                  params: { username: item.username },
                }"
              >
                <div class="avatar">
                  <img v-src="item.avatar" />
                </div>
                <div class="name">{{ item.nickname || item.username }}</div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.browse_rank_wrap {
  padding: 24px;
  .rank_list {
    .rank_item {
      display: flex;
      border-bottom: 1px solid #e9e9e9;
      padding: 24px 0;
      &:last-child {
        border: none;
      }
      &:nth-child(-n + 3) {
        .number {
          color: #fc5531;
        }
      }
      .number {
        width: 60px;
        font-size: 28px;
        font-weight: bold;
      }
      .info {
        display: flex;
        flex-direction: column;
        width: calc(100% - 52px);
        .title {
          a {
            display: inline-block;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 16px;
            font-weight: bold;
            color: #222226;
            line-height: 32px;
            &:hover {
              color: #409eff;
            }
          }
        }
        .detail {
          width: 100%;
          display: flex;
          justify-content: space-between;
          margin-top: 15px;
          .read_times {
            display: flex;
            justify-content: center;
            align-items: center;
            i {
              margin-right: 8px;
              font-size: 20px;
            }
          }
          .user_info {
            a {
              display: flex;
              align-items: center;
              &:hover {
                color: #409eff;
              }
            }
            .avatar {
              img {
                width: 30px;
                height: 30px;
                object-fit: cover;
                border-radius: 50%;
                border: 1px solid #ededed;
              }
            }
            .name {
              padding-left: 10px;
            }
          }
        }
      }
    }
  }
}
</style>
