<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import useRequestModel from '@/hooks/useRequestModel'
import useRequestLoadMore from '@/hooks/useRequestLoadMore'
import useAttentionRank from '../composables/useAttentionRank'
import useAttention from '@/hooks/useAttentionUser'
import { bus } from '@/utils'
import { RouteName } from '@/enum/route'

const { requestData } = useRequestModel()
const { attentionRankList, getAttentionRankList } =
  useAttentionRank(requestData)
const { handleLoadMore } = useRequestLoadMore(requestData, getAttentionRankList)
const { handleAttention } = useAttention()

onMounted(() => bus.on('scroll-to-bottom', handleLoadMore))
onBeforeUnmount(() => bus.off('scroll-to-bottom', handleLoadMore))
</script>

<template>
  <div class="attention_rank_wrap">
    <div class="attention_list">
      <div
        class="attention_item"
        v-for="(item, index) in attentionRankList"
        :key="item.passive_id"
      >
        <div class="user_info">
          <div class="number">{{ index + 1 }}</div>
          <div class="avatar">
            <router-link
              :to="{
                name: RouteName.USER_CENTER_NAME,
                params: { username: item.username },
              }"
              ><img v-src="item.avatar"
            /></router-link>
          </div>
          <div class="info_wrap">
            <div class="name">
              <router-link
                :to="{
                  name: RouteName.USER_CENTER_NAME,
                  params: { username: item.username },
                }"
                >{{ item.nickname || item.username }}</router-link
              >
            </div>
            <div class="fans">粉丝&nbsp;{{ item.fans_num }}</div>
          </div>
        </div>
        <div class="attention_btn">
          <div class="self" v-if="item.self">自己</div>
          <div
            class="btn"
            v-else-if="!item.is_attention"
            @click="
              handleAttention(
                item.is_attention,
                item.passive_id,
                () => (item.is_attention = !item.is_attention)
              )
            "
          >
            关注
          </div>
          <div
            class="cancel_btn"
            v-else
            @click="
              handleAttention(
                item.is_attention,
                item.passive_id,
                () => (item.is_attention = !item.is_attention)
              )
            "
          >
            取消关注
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.attention_rank_wrap {
  padding: 24px;
  .attention_list {
    .attention_item {
      display: flex;
      justify-content: space-between;
      padding: 15px 0;
      border-bottom: 1px solid #e9e9e9;
      &:last-child {
        border: none;
      }
      &:nth-child(-n + 3) {
        .number {
          color: #fc5531;
        }
      }
      .user_info {
        display: flex;
        width: calc(100% - 100px);
        .number {
          padding-right: 40px;
          font-size: 28px;
          font-weight: bold;
          display: flex;
          align-items: center;
        }
        .avatar {
          img {
            width: 55px;
            height: 55px;
            object-fit: cover;
            border-radius: 50%;
            border: 1px solid #ededed;
          }
        }
        .info_wrap {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          padding-left: 20px;
          width: calc(100% - 100px);
          .name {
            color: #1c1d30;
            font-size: 16px;
            a {
              width: 100%;
              display: inline-block;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
          }
          .fans {
            color: #777888;
          }
        }
      }
      .attention_btn {
        display: flex;
        align-items: center;
        div {
          width: 75px;
          height: 24px;
          border-radius: 12px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }
        .self {
          background: #409eff;
          color: #fff;
        }
        .btn {
          border: 1px solid #409eff;
          color: #409eff;
          &:hover {
            background: #409eff;
            color: #fff;
          }
        }
        .cancel_btn {
          border: 1px solid #555666;
          color: #555666;
          &:hover {
            opacity: 0.6;
          }
        }
      }
    }
  }
}
</style>
