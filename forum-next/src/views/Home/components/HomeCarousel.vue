<script setup lang="ts">
import type { CarouselItem } from '@/types/carousel'
import { RouteName } from '@/enum/route'

interface Props {
  carouselList: Array<CarouselItem>
  showModel: string
}
const { carouselList, showModel } = defineProps<Props>()
</script>

<template>
  <div class="carousel" :class="{ [showModel]: true }">
    <el-carousel trigger="click" height="300px">
      <el-carousel-item v-for="item in carouselList" :key="item.id">
        <router-link
          class="img-wrap"
          :to="{
            name: RouteName.POST_NAME,
            params: { postId: item.id, username: item.username },
          }"
        >
          <img v-src="item.img" :alt="item.title" />
          <h3 class="title">{{ item.title }}</h3>
        </router-link>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<style lang="scss" scoped>
.carousel {
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 12px;
  border: 5px solid #fff;
  position: relative;
  .el-carousel {
    .img-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 100%;
    }
    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
    .title {
      position: absolute;
      color: #fff;
      padding: 0 20px;
      left: 0;
      bottom: 30px;
      font-size: 16px;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
