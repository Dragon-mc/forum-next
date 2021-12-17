<script setup lang="ts">
import type { CateInfo } from '@/types/category'

interface Props {
  cateInfo: CateInfo
}
defineProps<Props>()
</script>

<template>
  <div class="cate_introduction">
    <div class="title">{{ cateInfo.name || '所有分类内容' }}</div>
    <div class="desc">{{ cateInfo.desc }}</div>
  </div>
</template>

<style lang="scss" scoped>
.cate_introduction {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  .title {
    color: #20232c;
    font-size: 18px;
    font-weight: bold;
  }
  .desc {
    padding-top: 12px;
    color: #555666;
  }
}
</style>
