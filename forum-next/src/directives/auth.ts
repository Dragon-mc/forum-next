import { App, DirectiveBinding } from 'vue'
import { checkLogin } from '@/utils/auth'

export function authDirctive(app: App) {
  // 按钮权限指令
  app.directive('click-auth', {
    created(el: HTMLElement, binding: DirectiveBinding) {
      // 创建时绑定事件监听，用于查看是否登录
      el.addEventListener('click', (e) => {
        if (!checkLogin()) return
        binding.value && binding.value()
        binding.modifiers.stop && e.stopPropagation()
        binding.modifiers.prevent && e.preventDefault()
      })
    }
  })
}
