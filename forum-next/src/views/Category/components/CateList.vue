<script setup lang="ts">
import type { CategoryNameList } from '@/types/category'
import { RouteName } from '@/enum/route'

interface Props {
  showModel: string
  cateList: Array<CategoryNameList>
}
defineProps<Props>()
</script>

<template>
  <el-col :md="8" :lg="8" :xl="8" :class="{ [showModel]: true }">
    <div class="cate_list_wrap">
      <div class="cate_title">
        <span class="txt">分类列表</span>
      </div>
      <el-collapse accordion>
        <el-collapse-item
          v-for="item in cateList"
          :key="item.id"
          :title="item.name"
          :name="item.id"
        >
          <div
            v-for="subItem in item.sub_cate"
            :key="subItem.id"
            class="cate_item"
          >
            <router-link
              :to="{
                name: RouteName.CATE_NAME,
                query: { sub_cate: subItem.id },
              }"
              >{{ subItem.name }}</router-link
            >
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </el-col>
</template>

<style lang="scss" scoped>
.cate_list_wrap {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  .cate_title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #20232c;
    font-weight: bolder;
    margin-bottom: 16px;
    .txt {
      font-size: 18px;
    }
  }
  .is-active {
    color: #409eff;
  }
  .cate_item {
    padding: 5px 0 5px 20px;
    a {
      display: inline-block;
      width: 100%;
      height: 100%;
      color: #20232c;
    }
  }
  .el-collapse-item__header {
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
