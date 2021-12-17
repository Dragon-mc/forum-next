<script setup lang="ts">
import { reactive, onBeforeUnmount, nextTick } from 'vue'
import { uploadImg } from '@/api/post'
import { debounce } from '@/utils'
import VMdEditor from '@kangc/v-md-editor/lib/codemirror-editor'
import '@kangc/v-md-editor/lib/style/codemirror-editor.css'
import Theme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'

import hljs from 'highlight.js'

// codemirror 编辑器的相关资源
import Codemirror from 'codemirror'
// mode
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/css/css'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/vue/vue'
// edit
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/matchbrackets'
// placeholder
import 'codemirror/addon/display/placeholder'
// active-line
import 'codemirror/addon/selection/active-line'
// scrollbar
import 'codemirror/addon/scroll/simplescrollbars'
import 'codemirror/addon/scroll/simplescrollbars.css'
// style
import 'codemirror/lib/codemirror.css'

VMdEditor.Codemirror = Codemirror
VMdEditor.use(Theme, {
  Hljs: hljs,
})

interface Props {
  content: string,
  plain: string
}
defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:content', value: string): void,
  (e: 'update:plain', value: string): void
}>()

const markdownConfig = reactive({
  height: 600,
})

// markdown上传图片
const handleMarkdownUpload = async (event: any, insertImage: Function, [file]: Array<File>) => {
  const formData = new FormData()
  formData.append('file', file)
  const res = await uploadImg(formData)
  insertImage({
    url: res.data.url,
    desc: file.name
  })
}

const resizeFunc = debounce(() => {
  markdownConfig.height = window.innerHeight - 55
}, 10)

resizeFunc()
window.addEventListener('resize', resizeFunc)
onBeforeUnmount(() => window.removeEventListener('resize', resizeFunc))

const whiteSpaceRe = /[ \f\t\r\n]+/g
const handleContentChange = function (event: string) {
  emit('update:content', event)
  // nexttick保证获取页面更新后的文本内容
  nextTick(() => {
    const preview = document.querySelector('.v-md-editor-preview')
    const plain = (preview && (<HTMLDivElement>preview).innerText) || ''
    emit('update:plain', plain.replace(whiteSpaceRe, '').substr(0, 250))
  })
}
</script>

<template>
  <VMdEditor
    :model-value="content"
    @update:model-value="handleContentChange($event)"
    :height="`${markdownConfig.height}px`"
    :disabled-menus="[]"
    @upload-image="handleMarkdownUpload"
  />
</template>

<style lang="scss" scoped></style>
