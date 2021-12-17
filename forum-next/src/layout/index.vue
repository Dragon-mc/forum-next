<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, onUnmounted } from 'vue'
import BaseHeader from '@/components/BaseHeader/index.vue'
import BaseFooter from '@/components/BaseFooter.vue'
import { getUserInfo } from '@/api/user'
import { delUserInfo, setUserInfo, getToken } from '@/utils/auth'
import { bus } from '@/utils'

const scrollbar = ref<any>(null)
const scroll = () => {
  const scrollEl = scrollbar.value.wrap
  // 页面滚动高度
  let scroll = scrollEl.scrollTop
  // 窗口显示区高度
  let clientHeight = scrollEl.clientHeight || scrollEl.offsetHeight
  // 页面总高度
  let pageHeight = scrollEl.scrollHeight
  if (scroll + clientHeight >= pageHeight) {
    // 页面触底，加载数据
    bus.emit('scroll-to-bottom')
  }
}

// 获取用户信息
getToken() && getUserInfo()
  .then((res) => {
    setUserInfo(res.data)
    bus.emit('user-info-update')
  })
  .catch((e) => {})

onMounted(() => {
  // 添加页面滚动事件，检测页面触底，加载数据
  scrollbar.value.wrap.addEventListener('scroll', scroll)
})

onBeforeUnmount(() => {
  scrollbar.value.wrap.removeEventListener('scroll', scroll)
})

onUnmounted(delUserInfo)
</script>

<template>
  <BaseHeader />
  <div class="app-main">
    <el-scrollbar ref="scrollbar">
      <router-view></router-view>
      <BaseFooter />
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.app-main {
  height: calc(100vh - #{$header-height});
  background-color: rgb(245, 246, 247);
}
</style>
