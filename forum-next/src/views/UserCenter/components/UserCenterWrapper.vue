<script setup lang="ts">
import { computed, ComputedRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import useUserCenterInfo from '../composables/useUserCenterInfo'
import SideBar from './SideBar.vue'
import InfoCard from './InfoCard.vue'
import { RouteName } from '@/enum/route'

const $route = useRoute()

const { userInfo, userInfoPromise, getUserCenterInfo } = useUserCenterInfo()

const infoPrefix: ComputedRef = computed(() => {
  return userInfo.value.self ? '我' : 'TA'
})
const profilePrefix: ComputedRef = computed(() => {
  return userInfo.value.self ? '我的' : 'TA的'
})

watch(() => $route, (route) => {
  if (route.name === RouteName.USER_CENTER_NAME) {
    getUserCenterInfo()
  }
}, { deep: true })

</script>

<template>
  <div class="user_center_wrap">
    <InfoCard :user-info="userInfo" />
    <div class="container_wrap my-container">
      <el-row :gutter="12">
        <!-- <div class="main"> -->
        <el-col :span="3">
          <SideBar
            :user-info="userInfo"
            :profile-prefix="profilePrefix"
            :info-prefix="infoPrefix"
          />
        </el-col>
        <el-col :span="21">
          <div class="content">
            <router-view
              :user-info="userInfo"
              :user-info-promise="userInfoPromise"
              :profile-prefix="profilePrefix"
            ></router-view>
          </div>
        </el-col>
        <!-- </div> -->
      </el-row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user_center_wrap {
  min-height: $page-min-height;
  background: rgb(245, 246, 247);
  .container_wrap {
    padding: 12px 0;
    .content {
      background: #fff;
      border-radius: 12px;
    }
  }
}
</style>
