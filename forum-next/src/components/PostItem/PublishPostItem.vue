<script setup lang="ts">
import { useRouter } from 'vue-router'
import { View, ChatDotRound, Delete, Edit } from '@element-plus/icons'
import { fromNow } from '@/utils/computed'
import type { PublishPostItem as PublishPostItemType } from '@/types/post'
import { RouteName, PREFIX, TypeToEditor } from '@/enum/route'
import { setEditPost } from '@/utils/post'

const $router = useRouter()
interface Props {
  postItem: PublishPostItemType
  self: boolean | undefined
  index: number
}
defineProps<Props>()
defineEmits<{
  (e: 'delete-post', postId: string | number, index: number): void
}>()

const username = $router.currentRoute.value.params.username || ''

const handleEdit = (item: PublishPostItemType) => {
  // setEditPost(item)
  $router.push({
    name: RouteName.EDIT_NAME,
    params: {
      type: TypeToEditor[`${PREFIX}${item.type}`]
    },
    query: {
      postid: item.id
    }
  })
}
</script>

<template>
  <div class="collection_item">
    <el-row class="time_and_interactive">
      <el-col :span="20" class="time">
        发布于：{{ fromNow(postItem.time) }}
      </el-col>
      <el-col :span="4" class="info_right">
        <el-row :gutter="12">
          <el-col :sm="12" :md="12" :lg="12" :xl="12" class="read_num">
            <a href="javascript:;"
              ><el-icon><View /></el-icon>{{ postItem.read_times }}</a
            >
          </el-col>
          <el-col :sm="12" :md="12" :lg="12" :xl="12" class="comment_num">
            <a href="javascript:;"
              ><el-icon><ChatDotRound /></el-icon
              >{{ postItem.comment_times }}</a
            >
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="post_info">
      <el-col :span="22" class="info_left">
        <div class="post_title">
          <router-link
            :to="{
              name: RouteName.POST_NAME,
              params: { postId: postItem.id, username },
            }"
            >{{ postItem.title }}</router-link
          >
        </div>
        <div class="post_content">
          {{ postItem.plain }}
        </div>
      </el-col>
      <el-col :span="2" class="edit" v-if="self">
        <el-icon @click="handleEdit(postItem)"><Edit /></el-icon>
        <el-popconfirm
          icon="el-icon-info"
          icon-color="red"
          title="你确定删除这篇帖子吗？"
          @confirm="$emit('delete-post', postItem.id, index)"
        >
          <template #reference>
            <div>
              <el-icon><Delete /></el-icon>
            </div>
          </template>
        </el-popconfirm>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.collection_item {
  margin-top: 15px;
  padding: 18px;
  border: 1px solid #ededed;
  border-radius: 10px;
  &:hover {
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
  }
  .time_and_interactive {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
    .time {
      width: 100%;
    }
    .info_right {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      align-items: flex-end;
      i {
        font-size: 18px;
        margin-right: 3px;
        font-weight: bold;
        color: #6b6b6b;
      }
      a {
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
        &:hover {
          color: #409eff;
        }
      }
    }
  }
  .post_info {
    .info_left {
      .post_title {
        margin-bottom: 8px;
        a {
          display: inline-block;
          font-size: 18px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-weight: bold;
          width: 100%;
          &:link {
            color: #3d3d3d;
          }
          &:visited {
            color: #b8b8b8;
          }
          &:hover {
            color: #409eff;
          }
        }
      }
      .post_content {
        color: #8a8a8a;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .edit {
      height: 54px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      i {
        font-size: 20px;
        cursor: pointer;
        &:hover {
          color: #409eff;
        }
      }
      .el-icon-delete {
        &:hover {
          color: #fc5531;
        }
      }
    }
  }
}
</style>
