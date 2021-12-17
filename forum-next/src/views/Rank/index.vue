<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouteLocationNormalized, useRoute } from 'vue-router'
import BrowseRankList from './components/BrowseRankList.vue'
import CommentRankList from './components/CommentRankList.vue'
import AttentionRankList from './components/AttentionRankList.vue'
import Page404 from '@/views/404/index.vue'
import { RouteName } from '@/enum/route'
import { RankType } from '@/enum/rank'

const $route = useRoute()

const RankMap = {
  [RankType.BROWSE_TYPE]: BrowseRankList,
  [RankType.COMMENT_TYPE]: CommentRankList,
  [RankType.ATTENTION_TYPE]: AttentionRankList,
}
const IndicatorIndexMap = {
  [RankType.BROWSE_TYPE]: 1,
  [RankType.COMMENT_TYPE]: 2,
  [RankType.ATTENTION_TYPE]: 3,
}

const nowRankType = $route.params.rankType
const nowIndicator = ref(IndicatorIndexMap[<RankType>nowRankType] || 0)
const indicatorIndex = ref(nowIndicator.value)

const nowComponent = ref(RankMap[<RankType>nowRankType] || Page404)

watch(
  $route,
  (route: RouteLocationNormalized) => {
    const nowRankType = route.params.rankType
    nowIndicator.value = IndicatorIndexMap[<RankType>nowRankType] || 0
    indicatorIndex.value = nowIndicator.value
    nowComponent.value = RankMap[<RankType>nowRankType] || Page404
  },
  { deep: true }
)
</script>

<template>
  <div class="rank_wrap">
    <div class="my-container inner">
      <el-row :gutter="12">
        <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
          <div class="rank_select">
            <ul>
              <li
                @mouseenter="
                  indicatorIndex = IndicatorIndexMap[RankType.BROWSE_TYPE]
                "
                @mouseleave="indicatorIndex = nowIndicator"
              >
                <router-link
                  :to="{
                    name: RouteName.RANK_NAME,
                    params: { rankType: RankType.BROWSE_TYPE },
                  }"
                  >浏览排行</router-link
                >
              </li>
              <li
                @mouseenter="
                  indicatorIndex = IndicatorIndexMap[RankType.COMMENT_TYPE]
                "
                @mouseleave="indicatorIndex = nowIndicator"
              >
                <router-link
                  :to="{
                    name: RouteName.RANK_NAME,
                    params: { rankType: RankType.COMMENT_TYPE },
                  }"
                  >评论排行</router-link
                >
              </li>
              <li
                @mouseenter="
                  indicatorIndex = IndicatorIndexMap[RankType.ATTENTION_TYPE]
                "
                @mouseleave="indicatorIndex = nowIndicator"
              >
                <router-link
                  :to="{
                    name: RouteName.RANK_NAME,
                    params: { rankType: RankType.ATTENTION_TYPE },
                  }"
                  >关注排行</router-link
                >
              </li>
              <div
                class="rank_indicator"
                :style="{
                  transform: `translateY(${(indicatorIndex - 1) * 55}px)`,
                }"
              ></div>
            </ul>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
          <div class="rank_list_wrap">
            <Component :is="nowComponent" />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.rank_wrap {
  min-height: $page-min-height;
  background: #f5f6f7;
  padding-bottom: 30px;
  .inner {
    padding-top: 12px;
    .rank_select {
      background: #fff;
      border-radius: 12px;
      padding: 24px;
      ul {
        position: relative;
        li {
          font-weight: bold;
          height: 35px;
          margin-top: 20px;
          &:first-child {
            margin-top: 0;
          }
          &:hover {
            background: #efefef;
            border-radius: 5px;
          }
          .router-link-active {
            color: #409eff;
          }
          a {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            font-size: 16px;
            color: #1c1d30;
          }
        }
        .rank_indicator {
          position: absolute;
          left: 0;
          top: 7px;
          width: 3px;
          height: 21px;
          background: #409eff;
          transition-duration: 0.3s;
        }
      }
    }
    .rank_list_wrap {
      background: #fff;
      border-radius: 12px;
    }
  }
}
</style>
