<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons'
import { RouteName } from '@/enum/route'

const $router = useRouter()

const searchInput = ref<string>('')
const handldSearch = () => {
  if (searchInput.value.trim() === '') return
  $router.push({
    name: RouteName.SEARCH_NAME,
    query: { keywords: searchInput.value },
  })
}
</script>

<template>
  <div class="search_wrap">
    <el-input
      placeholder="请输入搜索内容"
      v-model="searchInput"
      class="search_input"
      size="small"
      @keyup.enter="handldSearch"
    ></el-input>
    <el-button
      :icon="Search"
      type="primary"
      @click="handldSearch"
      size="mini"
      class="search_btn"
    ></el-button>
  </div>
</template>

<style lang="scss" scoped>
.search_wrap {
  display: flex;
  // width: 100%;
  :deep(.search_input) {
    input {
      border-radius: 16px 0 0 16px;
    }
  }
  .search_btn {
    border-radius: 0 16px 16px 0;
  }
}
</style>
