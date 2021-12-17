import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { setupGuard } from './guard'
import Layout from '@/layout/index.vue'
import { RouteName } from '@/enum/route'
import { checkUserExist } from '@/api/register'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home',
    component: Layout,
    children: [
      {
        path: '/home',
        name: RouteName.HOME_NAME,
        component: () => import('@/views/Home/index.vue'),
      },
      {
        path: '/cate',
        name: RouteName.CATE_NAME,
        component: () => import('@/views/Category/index.vue'),
      },
      {
        path: '/uc/:username?',
        name: RouteName.USER_CENTER_NAME,
        beforeEnter: async (to, from, next) => {    
          // 进入用户个人中心前查看用户是否存在
          const username = <string>to.params.username
          if (!username) {
            next(false)
            return
          }
          const valid: any = await checkUserExist({ username })
          if (valid.data) {
            next()
          } else {
            next({ name: RouteName.PAGE_404 })
          }
        },
        component: () => import('@/views/UserCenter/index.vue'),
        children: [
          {
            path: '/uc/:username?',
            // 重定向到profile页面
            redirect: (to) => {
              return {
                name: RouteName.USER_PROFILE_NAME,
                params: to.params,
              }
            },
          },
          {
            path: 'profile',
            name: RouteName.USER_PROFILE_NAME,
            component: () =>
              import('@/views/UserCenter/components/UserProfile/index.vue'),
          },
          {
            path: 'collection',
            name: RouteName.USER_COLLECTION_NAME,
            component: () =>
              import('@/views/UserCenter/components/UserCollection/index.vue'),
          },
          {
            path: 'publish',
            name: RouteName.USER_PUBLISH_NAME,
            component: () =>
              import('@/views/UserCenter/components/UserPublish/index.vue'),
          },
          {
            path: 'draft',
            name: RouteName.USER_DRAFT_NAME,
            component: () =>
              import('@/views/UserCenter/components/UserDraft/index.vue'),
          },
          {
            path: 'attention',
            name: RouteName.USER_ATTENTION_NAME,
            component: () =>
              import('@/views/UserCenter/components/UserAttention/index.vue'),
          },
          {
            path: 'fans',
            name: RouteName.USER_FANS_NAME,
            component: () =>
              import('@/views/UserCenter/components/UserFans/index.vue'),
          },
          {
            path: 'histroy',
            name: RouteName.USER_HISTORY_NAME,
            component: () =>
              import('@/views/UserCenter/components/UserHistory/index.vue'),
          },
          {
            path: 'feedback',
            name: RouteName.USER_FEEDBACK_NAME,
            component: () =>
              import('@/views/UserCenter/components/UserFeedback/index.vue'),
          },
          {
            path: 'post/:postId',
            name: RouteName.POST_NAME,
            props: true,
            component: () => import('@/views/Post/index.vue'),
          },
        ],
      },
      {
        path: '/search',
        name: RouteName.SEARCH_NAME,
        component: () => import('@/views/Search/index.vue'),
      },
      {
        path: '/rank/:rankType',
        name: RouteName.RANK_NAME,
        component: () => import('@/views/Rank/index.vue'),
      },
      {
        path: '/404',
        name: RouteName.PAGE_404,
        component: () => import('@/views/404/index.vue'),
      }
    ],
  },
  {
    path: '/editor/:type',
    name: RouteName.EDIT_NAME,
    props: true,
    component: () => import('@/views/Editor/index.vue'),
  },
  {
    path: '/login',
    name: RouteName.LOGIN_NAME,
    component: () => import('@/views/Login/index.vue'),
  },
  {
    path: '/oauth/:type',
    name: RouteName.OAUTH_NAME,
    component: () => import('@/views/Login/components/Oauth.vue')
  },
  {
    path: '/register',
    name: RouteName.REGISTER_NAME,
    component: () => import('@/views/Register/index.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/404/index.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
setupGuard(router)

export default router
