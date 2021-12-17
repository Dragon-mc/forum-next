<script setup lang="ts">
import { ref } from 'vue'
import { setHistory } from '@/utils/auth'
import useCollectionPost from '@/hooks/useCollectionPost'
import usePostInfo from './composables/usePostInfo'
import AuthorCard from './components/AuthorCard.vue'
import CommentInfo from './components/CommentInfo.vue'
import PostInfo from './components/PostInfo.vue'

interface Props {
  postId: number | string
}
const { postId } = defineProps<Props>()

const commentRef = ref<any>(null)

// 帖子收藏
const { handleCollection } = useCollectionPost()

// 帖子信息
const { postInfo, handleCollectionPost, handleFansChange } =
  usePostInfo(postId, handleCollection)

// 设置浏览历史
setHistory(postId)
</script>
<script lang="ts">

// // 代码高亮的js
// const hljs = require('highlight.js')
// window.hljs = hljs
// // 样式文件
// import 'highlight.js/styles/atom-one-dark.css'
// // 行号插件
// require('highlightjs-line-numbers.js')
// window.hljs.initHighlightingOnLoad()
// window.hljs.initLineNumbersOnLoad({
//   singleLine: true,
// })
// moment.locale('zh-ch')

// // 代码高亮渲染
// const highlightCode = () => {
//   const preEl = document.querySelectorAll('pre')
//   console.log(preEl)
//   preEl.forEach((el) => {
//     // language-markup为html代码，highlight无法解析，所以转换成language-html
//     el.className = el.className.replace('language-markup', 'language-html')
//     window.hljs.highlightBlock(el.firstElementChild)
//     window.hljs.lineNumbersBlock(el.firstElementChild)
//   })
// }

export default {
  updated() {
    // 页面刷新时也同时渲染代码高亮，保证代码一直是高亮状态
    // if (this.postInfo.type == 1) highlightCode()
  },
}
</script>

<template>
  <div class="post_wrap" @click.exact="commentRef && commentRef.restCommentState">
    <div class="my-container">
      <el-row :gutter="12" class="main">
        <div class="cover" v-if="Number(postInfo?.status) === 2">
          <img draggable="false" src="@/assets/cancel.png" />
        </div>
        <el-col :xs="24" :sm="24" :md="6" :lg="5" :xl="5">
          <AuthorCard :post-info="postInfo" @fans-change="handleFansChange" />
        </el-col>
        <el-col :xs="24" :sm="24" :md="18" :lg="19" :xl="19">
          <PostInfo
            :post-info="postInfo"
            :handle-collection-post="handleCollectionPost"
          />
          <CommentInfo ref="commentRef" :post-id="postId" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.post_wrap {
  min-height: $page-min-height;
  background: rgb(245, 246, 247);
  .main {
    padding-top: 12px;
    position: relative;
    .cover {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 100;
      display: flex;
      justify-content: center;
      img {
        opacity: 0.2;
        width: 200px;
        object-fit: scale-down;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
    }
  }
}
</style>
