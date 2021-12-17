<script setup lang="ts">
import { ref, ComputedRef } from 'vue'
import type { UserCenterInfo } from '@/types/user'
import type { UserRelationItem as UserRelationItemType } from '@/types/user'
import usePaginationModel from '@/hooks/usePaginationModel'
import { fetchFans } from '@/api/userCenter'
import UserRelationItem from '@/components/UserRelationItem.vue'
import type { requestFetchFans } from '@/types/request/userCenter'

interface Props {
  userInfoPromise: Promise<UserCenterInfo>
  profilePrefix: ComputedRef<string>
}
const { userInfoPromise } = defineProps<Props>()

const { paginationData, total, loading, handlePageChange } =
  usePaginationModel()

const fansList = ref<Array<UserRelationItemType>>([])
const getFansList = async () => {
  loading.value = true
  const data: requestFetchFans = Object.assign(paginationData.value, {
    id: (await userInfoPromise).id || ''
  })
  let res = await fetchFans(data)
  fansList.value = res.data.items
  total.value = res.data.total
  loading.value = false
}
getFansList()
</script>

<template>
  <div class="fans_wrap">
    <div class="title">{{ profilePrefix }}的粉丝</div>
    <div
      class="fans_list"
      v-loading="loading"
      v-if="loading || fansList.length"
    >
      <UserRelationItem
        v-for="item in fansList"
        :key="item.id"
        :relation-item="item"
      />
      <div class="pagination" v-if="total > paginationData.limit">
        <el-pagination
          @current-change="handlePageChange($event, getFansList)"
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
.fans_wrap {
  padding: 24px;
  .title {
    font-size: 16px;
    color: #222226;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .fans_list {
    min-height: 150px;
    .pagination {
      .el-pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 15px;
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
