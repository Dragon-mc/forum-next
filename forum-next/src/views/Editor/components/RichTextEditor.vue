<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import { debounce } from '@/utils'
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import { uploadImg } from '@/api/post'

import 'tinymce/themes/silver'
import 'tinymce/icons/default/icons'
// tinymce插件引入
import 'tinymce/plugins/print'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/directionality'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/visualchars'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/media'
import 'tinymce/plugins/template'
import 'tinymce/plugins/code'
import 'tinymce/plugins/codesample'
import 'tinymce/plugins/table'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/hr'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/nonbreaking'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/imagetools'
import 'tinymce/plugins/textpattern'
import 'tinymce/plugins/help'
import 'tinymce/plugins/emoticons'
import 'tinymce/plugins/autosave'
// import 'tinymce/plugins/bdmap'
// import 'tinymce/plugins/indent2em'
import 'tinymce/plugins/autoresize'
// import 'tinymce/plugins/lineheight'
// import 'tinymce/plugins/formatpainter'
// import 'tinymce/plugins/axupimgs'

interface Props {
  content: string,
  plain: string
}
const { content } = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:content', value: string): void,
  (e: 'update:plain', value: string): void,
}>()

const publicPath = import.meta.env.VITE_PUBLIC_PATH
let mce: HTMLElement | null = null
const editorInit = {
  language_url: `${publicPath}tinymce/langs/zh_CN.js`, // 指定中文包
  language: 'zh_CN', // 中文
  skin_url: `${publicPath}tinymce/skins/ui/oxide`, // 编辑器皮肤
  emoticons_database_url: `${publicPath}tinymce/emojis.js`,
  browser_spellcheck: true, // 拼写检查
  branding: false, // 去水印
  elementpath: true, // 禁用编辑器底部的状态栏
  statusbar: true, // 隐藏编辑器底部的状态栏
  paste_data_images: true, // 允许粘贴图像
  menubar: true, // 隐藏最上方menu
  plugins:
    'print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount imagetools textpattern help emoticons autosave', // bdmap indent2em autoresize lineheight formatpainter axupimgs
  toolbar:
    'code undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | table image media charmap emoticons codesample hr pagebreak insertdatetime print preview | fullscreen ', // | bdmap indent2em lineheight formatpainter axupimgs
  // 编辑器高度
  height: 400,
  // min_height: 500,
  fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
  font_formats:
    '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats;知乎配置=BlinkMacSystemFont, Helvetica Neue, PingFang SC, Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei, sans-serif;小米配置=Helvetica Neue,Helvetica,Arial,Microsoft Yahei,Hiragino Sans GB,Heiti SC,WenQuanYi Micro Hei,sans-serif',
  importcss_append: true,
  autosave_ask_before_unload: false,
  // 初始化结束
  init_instance_callback: () => {
    mce = document.querySelector('.tox-tinymce')
    let height = window.innerHeight
    mce?.style.setProperty('height', height - 55 + 'px', 'important')
  },
  // 自定义图片上传回调
  images_upload_handler: async (
    blobInfo: any,
    succFun: Function,
    failFun: Function
  ) => {
    const file = blobInfo.blob()
    // 检查图片是否小于5MB
    if (file.size / 1024 / 1024 > 5) {
      ElMessage.error({ message: '上传图片大小不能超过 2MB!' })
      return
    }
    // 上传图片
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await uploadImg(formData)
      succFun(res.data.url)
    } catch (err) {
      failFun(err)
    }
  },
}

const resizeFunc = debounce(() => {
  mce?.style.setProperty('height', window.innerHeight - 55 + 'px', 'important')
}, 10)

window.addEventListener('resize', resizeFunc)
onBeforeUnmount(() => window.removeEventListener('resize', resizeFunc))

tinymce.init({})

const whiteSpaceRe = /[ \f\t\r\n]+/g
const handleContentChange = (event: string) => {
  const plain = tinymce.activeEditor.getContent({ format: 'text' })
  emit('update:plain', plain.replace(whiteSpaceRe, '').substr(0, 250))
  emit('update:content', event)
}
</script>

<template>
  <Editor
    :model-value="content"
    @update:model-value="handleContentChange($event)"
    :init="editorInit"
  />
</template>

<style lang="scss" scoped></style>
