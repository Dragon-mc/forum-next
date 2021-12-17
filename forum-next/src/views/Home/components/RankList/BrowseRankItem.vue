<script setup lang="ts">
import type { BrowseRankItemType } from '@/types/rank'
import { RouteName } from '@/enum/route'

interface Props {
  rankItem: BrowseRankItemType
}
defineProps<Props>()
</script>

<template>
  <el-col class="browse_item" :xs="12" :sm="12" :md="24" :lg="24" :xl="24">
    <router-link
      :to="{
        name: RouteName.POST_NAME,
        params: {
          postId: rankItem.id,
          username: rankItem.username,
        },
      }"
    >
      <img v-src="rankItem.avatar" />
      <div class="title">
        {{ rankItem.title }}
      </div>
    </router-link>
  </el-col>
</template>

<style lang="scss" scoped>
.browse_item {
  // border-bottom: 1px solid #f4f4f4;
  // height: 48px;
  margin-bottom: 16px;
  a {
    display: flex;
    // justify-content: space-between;
    img {
      object-fit: cover;
      // width: 64px;
      // height: 48px;
      object-fit: cover;
      height: 48px;
      border-radius: 3px;
      // width: 100%;
      width: 60px;
    }
    .title {
      // width: 194px;
      line-height: 24px;
      color: #3d3d3d;
      font-weight: bolder;
      letter-spacing: 0;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      width: calc(100% - 60px);
      padding-left: 12px;
      word-break: break-all;
    }
  }
}
</style>
