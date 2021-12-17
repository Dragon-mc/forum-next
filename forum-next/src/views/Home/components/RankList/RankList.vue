<script setup lang="ts">
import { RouteLocationRaw } from 'vue-router'

interface Props {
  title: string,
  toLink: RouteLocationRaw
}
defineProps<Props>()
</script>

<template>
  <div class="rank_list">
    <div class="rank_title">
      <span class="txt">{{ title }}</span>
      <router-link :to="toLink"
        ><el-tag size="small">查看更多</el-tag></router-link
      >
    </div>
    <el-row class="browse_list" :gutter="24">
      <slot></slot>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.rank_list {
  background: #fff;
  margin-bottom: 12px;
  padding: 16px;
  border-radius: 12px;
}

.rank_title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #20232c;
  font-weight: bolder;
  margin-bottom: 16px;
  .txt {
    font-size: 18px;
  }
  .el-tag:hover {
    opacity: 0.7;
    filter: alpha(opacity=70);
    cursor: pointer;
  }
}
</style>
