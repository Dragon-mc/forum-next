<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import type { CategoryNameList } from '@/types/category'
import { RouteName } from '@/enum/route'

interface Props {
  cateList: Array<CategoryNameList>
  cateListWidth: string
}
const props = defineProps<Props>()

const width = ref('auto')
// 监听窗口大小改变，调整分类选择栏宽度
const resizeFunction = () => {
  if (window.innerWidth < 992) {
    width.value = props.cateListWidth
  } else {
    width.value = 'auto'
  }
}
// 防止初次是小窗口时，宽度未被渲染
watch(() => props.cateListWidth, resizeFunction)

onMounted(() => {
  window.addEventListener('resize', resizeFunction)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeFunction)
})
</script>

<template>
  <el-col :md="2" :lg="2" :xl="2">
    <div class="ul_wrap">
      <ul class="nav_cate_bar clearfix" :style="{ width: width }">
        <li v-for="item in cateList" :key="item.id">
          <router-link
            :to="{ name: RouteName.CATE_NAME, query: { main_cate: item.id } }"
            >{{ item.name }}</router-link
          >
        </li>
      </ul>
    </div>
  </el-col>
</template>

<style lang="scss" scoped>
@media screen and (max-width: 992px) {
  .ul_wrap {
    overflow-y: hidden;
    overflow-x: scroll;
    .nav_cate_bar {
      // width: 85px * 13;
      li {
        float: left;
        width: 85px;
      }
    }
  }
}
.ul_wrap {
  min-height: 40px;
  background: #fff;
  border-radius: 12px;
  .nav_cate_bar {
    li {
      a {
        display: block;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #555666;
        &:hover {
          background: #f5f6f7;
          color: #222226;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
