<script setup lang="ts">
import CateList from './components/CateList.vue'
import CateInfo from './components/CateInfo.vue'
import CatePostList from './components/CatePostList.vue'
import useRequestModel from '@/hooks/useRequestModel'
import useCateList from '@/hooks/useCateList'
import usePostList from './composables/usePostList'
import useRequestLoadMore from '@/hooks/useRequestLoadMore'

// 请求参数
const { requestData, resetRequestData } = useRequestModel()

// 分类列表
const { cateList, getCateList } = useCateList()
getCateList()

// 分类帖子列表与分类信息
const { cateInfo, postList, getPostList } = usePostList(
  requestData,
  resetRequestData
)

// 加载更多
const { handleLoadMore } = useRequestLoadMore(requestData, getPostList)
</script>

<template>
  <div class="cate_wrap">
    <div class="container_wrap my-container">
      <el-row :gutter="12">
        <CateList show-model="hidden-md-and-up" :cate-list="cateList" />
        <el-col class="main" :md="16" :lg="16" :xl="16">
          <CateInfo :cate-info="cateInfo" />
          <CatePostList :post-list="postList" @load-more="handleLoadMore" />
        </el-col>
        <CateList show-model="hidden-sm-and-down" :cate-list="cateList" />
      </el-row>
    </div>
  </div>
</template>

<style lang="scss" scpoed>
.cate_wrap {
  min-height: $page-min-height;
  overflow-y: scroll;
  background: rgb(245, 246, 247);
  .container_wrap {
    padding: 12px 0;
  }
}
</style>
