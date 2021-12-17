<script setup lang="ts">
import { ref, ComputedRef } from 'vue'
import { ElMessage } from 'element-plus'
import type { UserCenterInfo } from '@/types/user'
import type { PublishPostItem as PublishPostItemType } from '@/types/post'
import usePaginationModel from '@/hooks/usePaginationModel'
import PublishPostItem from '@/components/PostItem/PublishPostItem.vue'
import { fetchPublish } from '@/api/userCenter'
import { deletePost } from '@/api/post'
import type { requestFetchPublish } from '@/types/request/userCenter'

interface Props {
  userInfo: UserCenterInfo
  userInfoPromise: Promise<UserCenterInfo>
  profilePrefix: ComputedRef<string>
}
const { userInfoPromise } = defineProps<Props>()

const { total, paginationData, loading, handlePageChange } =
  usePaginationModel()

const postList = ref<Array<PublishPostItemType>>([])
const getPublishList = async () => {
  loading.value = true
  const data: requestFetchPublish = Object.assign(paginationData.value, {
    id: (await userInfoPromise).id || ''
  })
  let res = await fetchPublish(data)
  postList.value = res.data.items
  total.value = res.data.total
  loading.value = false
}
getPublishList()

const handleDeletePost = async (postId: number | string, index: number) => {
  await deletePost({ post_id: postId })
  ElMessage.success({ message: '删除成功' })
  postList.value.splice(index, 1)
}
</script>

<template>
  <div class="my_publish_wrap">
    <div class="title">{{ profilePrefix }}发布的</div>
    <div class="collection_list" v-loading="loading" v-if="loading || postList.length">
      <PublishPostItem
        v-for="(item, index) in postList"
        :key="item.id"
        :post-item="item"
        :self="userInfo.self"
        :index="index"
        @delete-post="handleDeletePost"
      />
      <div class="pagination" v-if="total > paginationData.limit">
        <el-pagination
          @current-change="handlePageChange($event, getPublishList)"
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
.my_publish_wrap {
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
