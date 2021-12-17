<script setup lang="ts">
import type { HomePostItem } from '@/types/post'
import FullPostItem from '@/components/PostItem/FullPostItem.vue'

interface Props {
  postList: Array<HomePostItem>
}
const { postList } = defineProps<Props>()
</script>

<template>
  <div class="recoomend_list">
    <ul>
      <li v-for="item in postList" :key="item.id">
        <FullPostItem :post-item="item"/>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.recoomend_list {
  padding-bottom: 12px;
  ul {
    li {
      background: #fff;
      border-bottom: 1px solid #f4f4f4;
      height: 120px;
      padding: 18px 24px 13px;
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
  }
}
</style>
