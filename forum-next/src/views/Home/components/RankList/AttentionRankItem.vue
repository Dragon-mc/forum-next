<script setup lang="ts">
import type { AttentionRankItemType } from '@/types/rank'
import { RouteName } from '@/enum/route'

interface Props {
  rankItem: AttentionRankItemType
}
defineProps<Props>()
</script>

<template>
  <el-col class="attention_item" :xs="12" :sm="12" :md="24" :lg="24" :xl="24">
    <router-link
      :to="{
        name: RouteName.USER_CENTER_NAME,
        params: {
          username: rankItem.user_info.username,
        },
      }"
    >
      <img v-src="rankItem.user_info.avatar" />
      <div class="info">
        <div class="name">
          {{ rankItem.user_info.nickname || rankItem.user_info.username }}
        </div>
        <div class="attention_num">
          粉丝 {{ rankItem.passive_attention_num }}
        </div>
      </div>
    </router-link>
  </el-col>
</template>

<style lang="scss" scoped>
.attention_item {
  // height: 75px;
  padding: 12px 0;
  border-bottom: 1px solid #f4f4f4;
  a {
    display: flex;
    img {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 50%;
    }
    .info {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      // margin-left: 8px;
      height: inherit;
      padding-left: 12px;
      width: calc(100% - 50px);
      .name {
        font-size: 14px;
        color: #4d4d4d;
        font-weight: bold;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .attention_num {
        font-size: 12px;
        color: #6b6b6b;
      }
    }
  }
}
</style>
