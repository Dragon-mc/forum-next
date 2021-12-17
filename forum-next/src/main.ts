import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import { registeDirectives } from './directives'
import './utils/initMoment'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import './styles/iconfont.css'
import './styles/index.css'
import './styles/responsive.css'

const app = createApp(App)
  .use(router)
  .use(ElementPlus, { locale: zhCn })

registeDirectives(app)

app.mount('#app')
