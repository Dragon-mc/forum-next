<script setup lang="ts">
import { ref, ComputedRef } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { UserCenterInfo } from '@/types/user'
import type { DraftPostItem as DraftPostItemType } from '@/types/post'
import { fetchDraftPost } from '@/api/userCenter'
import { deletePost } from '@/api/post'
import usePaginationModel from '@/hooks/usePaginationModel'
import DraftPostItem from '@/components/PostItem/DraftPostItem.vue'
import type { requestFetchDraftPost } from '@/types/request/userCenter'

const $router = useRouter()

interface Props {
  userInfo: UserCenterInfo
  userInfoPromise: Promise<UserCenterInfo>
  profilePrefix: ComputedRef<string>
}
const { userInfoPromise } = defineProps<Props>()

const { total, paginationData, loading, handlePageChange } =
  usePaginationModel()

const draftList = ref<Array<DraftPostItemType>>([])
const getDraftPostInfo = async () => {
  loading.value = true
  const info = await userInfoPromise
  if (!info.self) {
    // 当前访问的不是自己的主页，则进入待发页面时非法的
    ElMessage.error({ message: '禁止访问' })
    $router.go(-1)
    return
  }
  const data: requestFetchDraftPost = Object.assign(paginationData.value, {
    id: info.id || ''
  })
  let res = await fetchDraftPost(data)
  draftList.value = res.data.items
  total.value = res.data.total
  loading.value = false
}
getDraftPostInfo()

const handleDelete = async (postId: string | number, index: number) => {
  await deletePost({ post_id: postId })
  ElMessage.success({ message: '删除成功' })
  draftList.value.splice(index, 1)
}
</script>

<template>
  <div class="draft_wrap">
    <div class="title">待发布</div>
    <div
      class="draft_list"
      v-loading="loading"
      v-if="loading || draftList.length"
    >
      <DraftPostItem
        v-for="(item, index) in draftList"
        :key="item.id"
        :post-item="item"
        :index="index"
        @delete-post="handleDelete"
      />
      <div class="pagination" v-if="total > paginationData.limit">
        <el-pagination
          @current-change="handlePageChange($event, getDraftPostInfo)"
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
.draft_wrap {
  padding: 24px;
  .title {
    font-size: 16px;
    color: #222226;
    font-weight: bold;
  }
  .draft_list {
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
