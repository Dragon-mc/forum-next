<script setup lang="ts">
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  EditorRoute,
  RouteName,
  EditorToType,
  TypeToEditor,
  PREFIX,
} from '@/enum/route'
import MarkdownEditor from './components/MarkdownEditor.vue'
import RichTextEditor from './components/RichTextEditor.vue'
import { getUserInfo } from '@/utils/auth'
import { fetchEditPostInfo } from '@/api/post'
import useEditorInfo from './composables/useEditorInfo'
import useEditorData from './composables/useEditorData'
import useEditorHandler from './composables/useEditorHandler'
import type { PostInfo } from '@/types/post'
import { PostState } from '@/enum/post'

interface Props {
  type: EditorRoute
}
const { type } = defineProps<Props>()

const $router = useRouter()
const $route = useRoute()
const postid = <string>$route.query.postid

const userInfo = getUserInfo()

const {
  content,
  plain,
  title,
  subId,
  isEdit,
  curPostInfo,
  editCurrentPost,
  publishCurrentPost,
} = useEditorData()

const {
  cateList,
  propsOption,
  isSave,
  checkValid,
  getCateList,
  handleReturnClick,
  handleCascaderChange,
} = useEditorInfo(content, title, subId)

const { handlePublish, handleSaveDraft, handleSaveEdit } = useEditorHandler(
  isEdit,
  isSave,
  curPostInfo,
  postid,
  checkValid,
  editCurrentPost,
  publishCurrentPost,
  type
)

const PostEditCheck = async () => {
  const cateListWaiting = getCateList()
  if (postid) {
    const res = await fetchEditPostInfo({
      post_id: postid,
    })
    if (res.data.success) {
      // 成功获取要编辑的信息
      curPostInfo.value = res.data.post
      const postInfo: PostInfo = res.data.post
      if (postInfo.type !== EditorToType[type]) {
        // 首先判断编辑类型是否正确，如果不正确则跳转正确的编辑器类型
        $router.replace({
          name: RouteName.EDIT_NAME,
          params: { type: TypeToEditor[`${PREFIX}${postInfo.type}`] },
        })
      } else {
        // 设置当前编辑帖子的信息
        content.value = postInfo.content
        title.value = postInfo.title
        isEdit.value = true
        // 设置分类
        await cateListWaiting
        cateList.value.forEach((cateItem, cateIndex) =>
          cateItem.sub_cate?.forEach((subCateItem) => {
            // 查找到分类id后返回
            if (Number(postInfo.sub_id) === Number(subCateItem.id)) {
              subId.value = [cateList.value[cateIndex].id, subCateItem.id]
              return false
            }
          })
        )
      }
    } else if (res.data.create) {
      // 编辑的内容不是自己的，直接切换为创建帖子
      $router.replace({
        name: RouteName.EDIT_NAME,
        params: { type },
      })
    } else {
      // 未登录
      $router.replace({
        name: RouteName.HOME_NAME,
      })
    }
  }
}
PostEditCheck()

watch([content, title], () => {
  isSave.value = false
})
</script>

<template>
  <div class="editor_wrap">
    <div class="top_wrap">
      <div class="return_btn" @click="handleReturnClick">
        <div class="left-arrow"></div>
        返回
      </div>
      <div class="input_title">
        <el-input
          v-model="title"
          placeholder="请输入文章标题"
          maxlength="100"
          show-word-limit
        ></el-input>
      </div>
      <div class="cascader">
        <el-cascader
          v-model="subId"
          :options="cateList"
          :props="propsOption"
          placeholder="选择分类"
          filterable
          clearable
          @change="handleCascaderChange"
        >
        </el-cascader>
      </div>
      <div class="func_btn">
        <template v-if="!isEdit || curPostInfo?.status === PostState.DRAFT">
          <el-button class="save_btn" @click="handleSaveDraft"
            >保存草稿</el-button
          >
          <el-button class="publish_btn" @click="handlePublish"
            >发布帖子</el-button
          >
        </template>
        <template v-else>
          <el-button class="publish_btn" @click="handleSaveEdit"
            >保存编辑</el-button
          >
        </template>
      </div>
      <div class="user_avatar">
        <img v-src="userInfo?.avatar" />
      </div>
    </div>
    <template v-if="type === EditorRoute.RICH_TEXT_NAME">
      <RichTextEditor
        ref="editor"
        v-model:content="content"
        v-model:plain="plain"
      />
    </template>
    <template v-else-if="type === EditorRoute.MARKDOWN_NAME">
      <MarkdownEditor v-model:content="content" v-model:plain="plain" />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.editor_wrap {
  .top_wrap {
    height: 55px;
    display: flex;
    background: #f3f3f3;
    .return_btn {
      width: 120px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      color: #666;
      &:hover {
        cursor: pointer;
      }
      .left-arrow {
        width: 10px;
        height: 10px;
        border: 2px solid #666;
        transform: rotate(45deg);
        border-right: none;
        border-top: none;
        margin-right: 5px;
      }
    }
    .input_title {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .cascader {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-left: 30px;
    }
    .func_btn {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 30px;
      .publish_btn {
        background: linear-gradient(45deg, #c9afff, #409eff);
        color: #fff;
        &:hover {
          opacity: 0.9;
        }
      }
    }
    .user_avatar {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-right: 40px;
      img {
        width: 35px;
        height: 35px;
        border-radius: 50%;
      }
    }
  }
}
</style>
