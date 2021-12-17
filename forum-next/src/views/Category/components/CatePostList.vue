<script setup lang="ts">
import type { HomePostItem } from '@/types/post'
import FullPostItem from '@/components/PostItem/FullPostItem.vue'
interface Props {
  postList: Array<HomePostItem>
}
defineProps<Props>()
defineEmits(['load-more'])

</script>

<template>
  <div class="recoomend_list">
    <div class="no_data" v-if="postList.length === 0">暂无数据</div>
    <ul v-else>
      <li v-for="item in postList" :key="item.id">
        <FullPostItem :post-item="item"/>
      </li>
      <div class="loading_more" @click="$emit('load-more')">加载更多...</div>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.recoomend_list {
  padding: 12px 0;
  ul {
    li {
      background: #fff;
      border-bottom: 1px solid #f4f4f4;
      height: 120px;
      padding: 18px 24px 13px;
    }
    li:first-child {
      border-radius: 12px 12px 0 0;
    }
    li:last-child {
      border-radius: 0 0 12px 12px;
    }
  }
  .no_data {
    background: #fff;
    height: 150px;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    color: #666;
  }
  .loading_more {
    background: #fff;
    padding: 12px 0;
    border-radius: 0 0 12px 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: #666;
    &:hover {
      font-weight: bold;
    }
  }
}
</style>
