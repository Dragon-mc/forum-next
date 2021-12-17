import { Router } from 'vue-router'
import { isLogin } from '@/utils/auth'
import { ElMessage } from 'element-plus'
import { RouteName } from '@/enum/route'

const whiteList = [
  RouteName.REGISTER_NAME,
  RouteName.LOGIN_NAME,
  RouteName.OAUTH_NAME,
  RouteName.HOME_NAME,
  RouteName.CATE_NAME,
  RouteName.POST_NAME,
  RouteName.RANK_NAME,
  RouteName.SEARCH_NAME,
  // 用户中心放行，谁都可以观看用户信息
  RouteName.USER_CENTER_NAME,
  RouteName.USER_PROFILE_NAME,
  RouteName.USER_COLLECTION_NAME,
  RouteName.USER_PUBLISH_NAME,
  RouteName.USER_DRAFT_NAME,
  RouteName.USER_ATTENTION_NAME,
  RouteName.USER_FANS_NAME,
  RouteName.USER_HISTORY_NAME,
  RouteName.USER_FEEDBACK_NAME,
  RouteName.PAGE_404
]

export function createAuthGuard(router: Router) {
  router.beforeEach((to, from, next) => {
    if (!isLogin() && !whiteList.includes(<RouteName>to.name)) {
      // 如果没有登录，并且即将路由的路径不在白名单
      ElMessage.error({ message: '请登录后操作!' })
      next({ name: RouteName.HOME_NAME })
    } else {
      next()
    }
  })
}
