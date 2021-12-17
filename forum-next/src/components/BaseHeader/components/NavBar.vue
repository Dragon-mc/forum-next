<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, RouteLocationNormalized } from 'vue-router'
import { getUserInfo } from '@/utils/auth'
import { RouteName } from '@/enum/route'

const $route = useRoute()
const userInfo = getUserInfo()
const indicatorMap: {
  [routeName: string]: number
} = {
  [RouteName.HOME_NAME]: 1,
  [RouteName.CATE_NAME]: 2,
  [RouteName.USER_CENTER_NAME]: 3,
  [RouteName.USER_PROFILE_NAME]: 3,
  [RouteName.USER_COLLECTION_NAME]: 3,
  [RouteName.USER_PUBLISH_NAME]: 3,
  [RouteName.USER_DRAFT_NAME]: 3,
  [RouteName.USER_ATTENTION_NAME]: 3,
  [RouteName.USER_FANS_NAME]: 3,
  [RouteName.USER_HISTORY_NAME]: 3,
  [RouteName.USER_FEEDBACK_NAME]: 3,
}

let nowIndicator = indicatorMap[<RouteName>$route.name] || 0
const indicator = ref<number>(nowIndicator)
const hasIndicator = ref<number>(nowIndicator ? 1 : 0)

const handleInNav = (index: number) => {
  hasIndicator.value = 1
  indicator.value = index
}
const handleOutNav = () => {
  if (nowIndicator) hasIndicator.value = 1
  else hasIndicator.value = 0
  indicator.value = nowIndicator
}

watch($route, (route: RouteLocationNormalized) => {
  const index = indicatorMap[<RouteName>route.name] || 0
  if (index) {
    nowIndicator = index
    indicator.value = nowIndicator
  } else {
    hasIndicator.value = 0
  }
})
</script>

<template>
  <ul class="navigator hidden-sm-and-down">
    <li
      @mouseenter="handleInNav(indicatorMap[RouteName.HOME_NAME])"
      @mouseleave="handleOutNav"
    >
      <router-link :to="{ name: RouteName.HOME_NAME }" title="首页"
        >首页</router-link
      >
    </li>
    <li
      @mouseenter="handleInNav(indicatorMap[RouteName.CATE_NAME])"
      @mouseleave="handleOutNav"
    >
      <router-link :to="{ name: RouteName.CATE_NAME }" title="分类"
        >分类</router-link
      >
    </li>
    <li
      @mouseenter="handleInNav(indicatorMap[RouteName.USER_CENTER_NAME])"
      @mouseleave="handleOutNav"
      v-click-auth
    >
      <router-link
        :to="{
          name: RouteName.USER_CENTER_NAME,
          params: { username: userInfo ? userInfo.username : '' },
        }"
        title="个人中心"
        >个人中心</router-link
      >
    </li>
    <div
      class="indicator"
      :style="{
        transform: `translateX(${(indicator - 1) * 70}px)`,
        width: 70 * hasIndicator + 'px',
      }"
    ></div>
  </ul>
</template>

<style lang="scss" scoped>
.navigator {
  height: 45px;
  display: flex;
  position: relative;
  a {
    width: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 45px;
    &:hover {
      background: #f5f5f5;
    }
  }
  .indicator {
    background: #409eff;
    height: 2px;
    position: absolute;
    bottom: 0;
    transition-property: transform;
    transition-duration: 0.3s;
  }
}
</style>
