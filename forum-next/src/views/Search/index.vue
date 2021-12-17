<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchSearchPost } from '@/api/search'
import usePaginationModel from '@/hooks/usePaginationModel'
import { RouteName } from '@/enum/route'
import type { SearchResultPostItem as SearchResultPostItemType } from '@/types/post'
import SearchResultPostItem from '@/components/PostItem/SearchResultPostItem.vue'

const $route = useRoute()
const $router = useRouter()

const { paginationData, total, loading, handlePageChange } =
  usePaginationModel(20)

const keywords = ref('')
const queryKeyWords = ref('')

const searchPostList = ref<Array<SearchResultPostItemType>>([])
const getSearchPostList = async () => {
  loading.value = true
  const data = {
    keywords: keywords.value || '',
    ...paginationData.value,
  }
  let res = await fetchSearchPost(data)
  searchPostList.value = res.data.items
  total.value = res.data.total
  loading.value = false
}

keywords.value = <string>$route.query.keywords || ''
queryKeyWords.value = keywords.value
getSearchPostList()

const handleSearch = () => {
  $router.push({
    path: RouteName.SEARCH_NAME,
    query: { keywords: keywords.value },
  })
}

watch(
  $route,
  () => {
    keywords.value = <string>$route.query?.keywords || ''
    queryKeyWords.value = keywords.value
    getSearchPostList()
  },
  { deep: true }
)
</script>

<template>
  <div class="search_wrap">
    <div class="my-container inner">
      <div class="search_input_wrap">
        <el-input v-model="keywords" @keyup.native.enter="handleSearch">
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="handleSearch"
          ></el-button>
        </el-input>
      </div>
      <div class="post_list">
        <ul v-loading="loading">
          <SearchResultPostItem
            v-for="item in searchPostList"
            :key="item.id"
            :result-item="item"
            :emphasized="queryKeyWords"
          />
          <div class="pagination">
            <el-pagination
              @current-change="handlePageChange($event, getSearchPostList)"
              :current-page="paginationData.page"
              :page-size="paginationData.limit"
              layout="total, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </div>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search_wrap {
  min-height: $page-min-height;
  background: #f5f6f7;
  .inner {
    padding-top: 12px;
    .search_input_wrap {
      background: #fff;
      padding: 15px 24px;
      border-radius: 12px;
    }
    .post_list {
      margin-top: 12px;
      .pagination {
        background: #fff;
        border-radius: 0 0 12px 12px;
        .el-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 120px;
        }
      }
    }
  }
}
</style>
