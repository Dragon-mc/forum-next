import { App, DirectiveBinding } from 'vue'

import backupImg from '@/assets/photo.jpg'

const errorSet = new Set<string>()

export function imageDirctive(app: App) {
  // 按钮权限指令
  app.directive('src', {
    created(el: HTMLImageElement, binding: DirectiveBinding) {
      const src = binding.value
      const modifiers = binding.modifiers
      setImg(el, src)
    },
    beforeUpdate(el: HTMLImageElement, binding: DirectiveBinding) {
      const src = binding.value
      setImg(el, src)
    }
  })
}

function setImg(el: HTMLImageElement, src: string | undefined) {
  if (src && !errorSet.has(src)) {
    el.setAttribute('src', src)
    // 如果图片存在，则检测是否加载失败
    el.onerror = () => {
      errorSet.add(src)
      setBackupImg(el)
      el.onerror = null
    }
  } else {
    // 图片不存在，则直接使用默认图片
    setBackupImg(el)
  }
}
function setBackupImg(el: HTMLImageElement, modifiers?: any) {
  el.setAttribute('src', backupImg)
}
