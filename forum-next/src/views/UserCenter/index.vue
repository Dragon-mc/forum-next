<script setup lang="ts">
import { shallowRef, watch } from 'vue'
import UserCenterWrapperVue from './components/UserCenterWrapper.vue'
import { RouteLocationNormalizedLoaded, RouterView, useRoute, useRouter } from 'vue-router'
import { RouteName } from '@/enum/route'

const $route = useRoute()
const $router = useRouter()

const currentRouter = shallowRef(UserCenterWrapperVue)

watch(
  $route,
  (route: RouteLocationNormalizedLoaded) => {
    if (route.name === RouteName.USER_CENTER_NAME) {
      $router.replace({
        name: RouteName.USER_PROFILE_NAME,
        params: route.params
      })
    }
    if (route.name === RouteName.POST_NAME && currentRouter.value !== <any>RouterView) {
      currentRouter.value = <any>RouterView
    } else if (currentRouter.value !== UserCenterWrapperVue) {
      currentRouter.value = UserCenterWrapperVue
    }
  },
  { deep: true, immediate: true }
)
</script>

<template>
  <Component :is="currentRouter" />
</template>
