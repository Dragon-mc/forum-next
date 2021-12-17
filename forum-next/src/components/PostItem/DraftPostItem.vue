<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Delete, Edit } from '@element-plus/icons'
import { timeParse } from '@/utils/computed'
import { RouteName, TypeToEditor, PREFIX } from '@/enum/route'
import type { DraftPostItem as DraftPostItemType } from '@/types/post'
import { setEditPost } from '@/utils/post'

const $router = useRouter()
interface Props {
  postItem: DraftPostItemType
  index: number
}
defineProps<Props>()
defineEmits<{
  (e: 'delete-post', postId: string | number, index: number): void
}>()

const handleEdit = (item: DraftPostItemType) => {
  // setEditPost(item)
  $router.push({
    name: RouteName.EDIT_NAME,
    params: {
      type: TypeToEditor[`${PREFIX}${item.type}`],
    },
    query: {
      postid: item.id,
    },
  })
}
</script>

<template>
  <div class="draft_item">
    <div class="head">
      <div class="left">
        <el-tag type="info">草稿</el-tag>
        <div class="time">{{ timeParse(postItem.time) }}</div>
      </div>
      <div class="edit">
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
      </div>
    </div>
    <div class="title_content">
      {{
        postItem.title
          ? postItem.title
          : postItem.plain
          ? postItem.plain
          : '暂未填写内容'
      }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.draft_item {
  padding: 15px;
  border: 1px solid #ededed;
  border-radius: 5px;
  margin-top: 15px;
  .head {
    display: flex;
    justify-content: space-between;
    .left {
      display: flex;
      align-items: center;
      color: #999aaa;
      .time {
        padding-left: 15px;
      }
    }
    .edit {
      display: flex;
      align-items: center;
      i {
        font-size: 20px;
        cursor: pointer;
        &:hover {
          color: #409eff;
        }
      }
      .el-icon-delete {
        margin-left: 20px;
        &:hover {
          color: #fc5531;
        }
      }
    }
  }
  .title_content {
    margin-top: 12px;
    color: #999aaa;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
