<script setup lang="ts">
import { useRouter } from 'vue-router'
import { RouteName } from '@/enum/route'

const $router = useRouter()

const handleToHome = () => {
  $router.replace({ name: RouteName.HOME_NAME })
}
</script>

<template>
  <div @click="handleToHome">404</div>
</template>

<style lang="scss" scoped>
div {
  height: $page-min-height;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 200px;
  font-weight: bold;
  color: #2980b9;
  cursor: pointer;
  text-shadow: 10px 10px 2px #dedede;
}
</style>
