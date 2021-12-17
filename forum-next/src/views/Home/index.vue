<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import CategoryNav from './components/CategoryNav.vue'
import HomeCarousel from './components/HomeCarousel.vue'
import PostList from './components/PostList.vue'
import RankList from './components/RankList/index.vue'
import useRequestModel from '@/hooks/useRequestModel'
import useRequestLoadMore from '@/hooks/useRequestLoadMore'
import useCarouselList from './composables/useCarouselList'
import useRecommendPostLIst from './composables/useRecommendPostList'
import useCateList from './composables/useCateList'
import useRankList from './composables/useRankList'
import { bus } from '@/utils'

// 请求参数模型
const { requestData, resetRequestData } = useRequestModel()

// 轮播图
const { carouselList } = useCarouselList()

// 推荐帖子列表
const { recommendPostList, getRecommendPostList } =
  useRecommendPostLIst(requestData)

// 分类列表
const { cateList, cateListWidth } = useCateList()

// 获取排行列表
const { browseRank, commentRank, attentionRank } = useRankList()

// 加载更多
const { handleLoadMore } = useRequestLoadMore(requestData, getRecommendPostList)

onMounted(() => bus.on('scroll-to-bottom', handleLoadMore))
onBeforeUnmount(() => bus.off('scroll-to-bottom', handleLoadMore))
</script>

<template>
  <!-- <el-scrollbar style="height: 100%" ref="scrollbar"> -->
  <div class="page">
    <div class="container_wrap my-container clearfix">
      <el-row :gutter="12">
        <!-- 左侧固定分类导航栏 -->
        <CategoryNav :cate-list="cateList" :cate-list-width="cateListWidth" />
        <!-- 右侧滚动内容 -->
        <el-col :md="22" :lg="22" :xl="22">
          <el-row :gutter="12">
            <!-- xs和sm大小的轮播图-->
            <el-col>
              <HomeCarousel
                show-model="hidden-md-and-up"
                :carousel-list="carouselList"
              />
            </el-col>
            <!-- xs和sm大小的侧边栏 -->
            <el-col
              class="aside hidden-md-and-up"
              :xs="{ span: 24, pull: 0 }"
              :sm="{ span: 24, pull: 0 }"
              :md="{ span: 7, push: 0 }"
              :lg="{ span: 7, push: 0 }"
              :xl="{ span: 7, push: 0 }"
            >
              <RankList
                :browseRank="browseRank"
                :commentRank="commentRank"
                :attentionRank="attentionRank"
              />
            </el-col>
            <!-- xs和sm大小的侧边栏 -->

            <el-col
              class="main"
              :xs="{ span: 24, push: 0 }"
              :sm="{ span: 24, push: 0 }"
              :md="{ span: 17, push: 0 }"
              :lg="{ span: 17, push: 0 }"
              :xl="{ span: 17, push: 0 }"
            >
              <!-- 轮播图 -->
              <HomeCarousel
                show-model="hidden-sm-and-down"
                :carousel-list="carouselList"
              />
              <!-- 推荐列表 -->
              <PostList :post-list="recommendPostList" />
            </el-col>
            <!-- md lg xl大小下的侧边栏 -->
            <el-col
              class="aside hidden-sm-and-down"
              :xs="{ span: 24, pull: 0 }"
              :sm="{ span: 24, pull: 0 }"
              :md="{ span: 7, push: 0 }"
              :lg="{ span: 7, push: 0 }"
              :xl="{ span: 7, push: 0 }"
            >
              <RankList
                :browseRank="browseRank"
                :commentRank="commentRank"
                :attentionRank="attentionRank"
              />
            </el-col>
            <!-- md lg xl大小下的侧边栏 -->
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
  <!-- </el-scrollbar> -->
</template>

<style lang="scss" scoped>
.page {
  min-height: $page-min-height;
  background: rgb(245, 246, 247);

  .container_wrap {
    padding: 12px 0;
  }
}
</style>
