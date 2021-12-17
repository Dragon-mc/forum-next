<script setup lang="ts">
import { onUpdated } from 'vue'
import VMdPreview from '@kangc/v-md-editor/lib/preview'
import '@kangc/v-md-editor/lib/style/preview.css'

import VMdPreviewHtml from '@kangc/v-md-editor/lib/preview-html'
import '@kangc/v-md-editor/lib/style/preview-html.css'

import Theme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'

import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
import 'highlightjs-line-numbers.js'

import { View, ChatDotRound } from '@element-plus/icons'
import { timeParse } from '@/utils/computed'
import type { PostDetailInfo } from '@/types/post'

VMdPreview.use(Theme, {
  Hljs: hljs,
})

interface Props {
  postInfo: PostDetailInfo | null
  handleCollectionPost: () => void
}
defineProps<Props>()
hljs.initHighlightingOnLoad()
// 代码高亮渲染
const highlightCode = () => {
  const preEl = document.querySelectorAll('pre')
  preEl.forEach((el) => {
    // language-markup为html代码，highlight无法解析，所以转换成language-html
    el.className = el.className.replace('language-markup', 'language-html')
    hljs.highlightElement(el.firstElementChild as HTMLElement)
  })
}

onUpdated(() => {
  highlightCode()
})
</script>

<template>
  <div class="content_wrap">
    <div class="post_info">
      <div class="time">{{ timeParse(postInfo?.time) }}</div>
      <div class="read_times">
        <el-icon><View /></el-icon>{{ postInfo?.read_times }}
      </div>
      <div class="comment_times">
        <el-icon><ChatDotRound /></el-icon>{{ postInfo?.comment_times }}
      </div>
      <div class="cate_tag">{{ postInfo?.cate_name }}</div>
      <div class="collection_icon" @click="handleCollectionPost">
        <i
          class="iconfont"
          :class="
            postInfo?.is_collection ? 'icon-collection-b' : 'icon-collection'
          "
        ></i
        >{{ postInfo?.collection_times }}
      </div>
    </div>
    <div class="title-box">
      <h1>{{ postInfo?.title }}</h1>
    </div>
    <VMdPreviewHtml v-if="postInfo?.type == 1" :html="postInfo?.content" preview-class="github-markdown-body" />
    <!-- 文章内容 -->
    <VMdPreview v-else-if="postInfo?.type === 2" :text="postInfo?.content" />
  </div>
</template>

<style lang="scss" scoped>
:deep(.github-markdown-body) {
  padding: 20px 0;
}
:deep(.vuepress-markdown-body) {
  padding: 20px 0;
}
.content_wrap {
  background: #fff;
  border-radius: 12px;
  padding: 25px;
  .markdown {
    border: none !important;
    .markdown-preview {
      padding: 0 !important;
      & > div {
        padding: 0 !important;
      }
    }
  }
  .post_info {
    display: flex;
    align-items: center;
    background: rgba(102, 177, 255, 0.1);
    padding: 15px;
    border-radius: 5px;
    color: #999aaa;
    .read_times {
      margin-left: 20px;
      display: flex;
      align-items: center;
    }
    .comment_times {
      margin-left: 20px;
      display: flex;
      align-items: center;
    }
    .cate_tag {
      margin-left: 25px;
      background: #fff;
      color: #409eff;
      padding: 5px 8px;
      border-radius: 5px;
      border: 1px solid #eaeaef;
      font-size: 12px;
    }
    .collection_icon {
      margin-left: 30px;
      cursor: pointer;
      .icon-collection-b {
        color: rgb(255, 204, 118);
      }
      &:hover {
        color: #409eff;
        .icon-collection {
          color: #409eff;
        }
      }
    }
    i {
      font-size: 18px;
      margin-right: 6px;
      font-weight: bold;
      color: #999aaa;
    }
  }
  .title-box {
    padding: 12px 0;
    h1 {
      font-size: 28px;
      word-wrap: break-word;
      color: #222226;
      font-weight: 600;
      margin: 0;
      word-break: break-all;
    }
  }
  .content_views {
    code {
      border-radius: 5px;
      /* 对于数字块 */
      .hljs-ln-numbers {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        text-align: center;
        color: #abb2bf;
        border-right: 1px solid #ccc;
        vertical-align: top;
        padding-right: 5px;
        /* 你的定制风格 */
        text-align: right;
        width: 40px;
        font-size: 16px;
        padding: 0 8px;
        .hljs-ln-n::before {
          font-size: 16px;
        }
      }
      /* 对于代码块 */
      .hljs-ln-code {
        padding-left: 10px;
      }
      .hljs-ln-line {
        height: 22px;
        line-height: 22px;
        font: 400 14px Source Code Pro, DejaVu Sans Mono, Ubuntu Mono,
          Anonymous Pro, Droid Sans Mono, Menlo, Monaco, Consolas, Inconsolata,
          Courier, monospace, PingFang SC, Microsoft YaHei, sans-serif !important;
      }
    }
  }
}
</style>
