<script setup lang="ts">
import { ref, ComputedRef } from 'vue'
import type { UserCenterInfo } from '@/types/user'
import type { CollectionPostItem as CollectionPostItemType } from '@/types/post'
import { fetchCollection } from '@/api/userCenter'
import CollectionPostItem from '@/components/PostItem/CollectionPostItem.vue'
import usePaginationModel from '@/hooks/usePaginationModel'
import type { requestFetchCollection } from '@/types/request/userCenter'

interface Props {
  userInfoPromise: Promise<UserCenterInfo>
  profilePrefix: ComputedRef<string>
}
const { userInfoPromise } = defineProps<Props>()

// 分页
const { total, paginationData, loading, handlePageChange } = usePaginationModel()

const collectionList = ref<Array<CollectionPostItemType>>([])
// 获取收藏列表
const getCollectionList = async () => {
  loading.value = true
  const data: requestFetchCollection = Object.assign(paginationData.value, {
    id: (await userInfoPromise).id || ''
  })
  let res = await fetchCollection(data)
  collectionList.value = res.data.items
  total.value = res.data.total
  loading.value = false
}
getCollectionList()
</script>

<template>
  <div class="collection_wrap">
    <div class="title">{{ profilePrefix }}收藏</div>
    <div class="collection_list" v-loading="loading" v-if="loading || collectionList.length">
      <CollectionPostItem
        v-for="item in collectionList"
        :key="item.id"
        :collection-item="item"
      />
      <div class="pagination" v-if="total > paginationData.limit">
        <el-pagination
          @current-change="handlePageChange($event, getCollectionList)"
          :current-page="paginationData.page"
          :page-size="paginationData.limit"
          layout="total, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <div class="no-data" v-else>
      <img src="@/assets/no-data.png" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.collection_wrap {
  padding: 24px;
  .title {
    font-size: 16px;
    color: #222226;
    font-weight: bold;
  }
  .collection_list {
    min-height: 200px;
    .pagination {
      .el-pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
      }
    }
  }
  .no-data {
    display: flex;
    justify-content: center;
    img {
      width: 30%;
    }
  }
}
</style>
