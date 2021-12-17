<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Edit, UserFilled, Menu } from '@element-plus/icons'
import { logout, isLogin, checkLogin, getUserInfo } from '@/utils/auth'
import { bus } from '@/utils'
import { RouteName, EditorRoute } from '@/enum/route'

const login = ref<boolean>(isLogin())
const userInfo = ref(getUserInfo())

const $router = useRouter()
const $route = useRoute()
bus.on('user-info-update', () => {
  userInfo.value = getUserInfo()
  login.value = isLogin()
})

// 退出登录
const handleLogout = () => {
  logout()
  ElMessage.success({ message: '退出成功！' })
  login.value = isLogin()
  if ($route.name !== RouteName.HOME_NAME) {
    $router.replace({ name: RouteName.HOME_NAME })
  }
}

// 选择编辑器类型
const editType = (type: EditorRoute) => {
  if (!checkLogin()) return
  $router.push({
    name: RouteName.EDIT_NAME,
    params: {
      type,
    },
  })
}
</script>

<template>
  <el-popover placement="bottom" :disabled="!login">
    <div class="edit-type-wrap">
      <div class="title">请选择编辑器类型</div>
      <div class="rich-edit">
        <el-button type="primary" @click="editType(EditorRoute.RICH_TEXT_NAME)"
          >富文本</el-button
        >
      </div>
      <div class="markdown-edit">
        <el-button type="success" @click="editType(EditorRoute.MARKDOWN_NAME)"
          >Markdown</el-button
        >
      </div>
    </div>
    <template #reference>
      <el-button
        v-click-auth.stop.prevent
        class="hidden-xs-only"
        type="primary"
        size="mini"
        :icon="Edit"
        round
        >发帖</el-button
      >
    </template>
  </el-popover>
  <div class="right_wrap">
    <el-dropdown v-if="login">
      <router-link
        :to="{
          name: RouteName.USER_CENTER_NAME,
          params: { username: userInfo?.username },
        }"
      >
        <img
          class="avatar"
          v-src="userInfo?.avatar"
        />
      </router-link>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>
            <router-link
              :to="{
                name: RouteName.USER_CENTER_NAME,
                params: { username: userInfo?.username },
              }"
            >
              <el-icon><UserFilled /></el-icon>个人中心
            </router-link>
          </el-dropdown-item>
          <el-popover placement="left" trigger="hover">
            <div class="edit-type-wrap">
              <div class="title">请选择编辑器类型</div>
              <div class="rich-edit">
                <el-button
                  type="primary"
                  @click="editType(EditorRoute.RICH_TEXT_NAME)"
                  >富文本</el-button
                >
              </div>
              <div class="markdown-edit">
                <el-button
                  type="success"
                  @click="editType(EditorRoute.MARKDOWN_NAME)"
                  >Markdown</el-button
                >
              </div>
            </div>
            <template #reference>
              <el-dropdown-item class="hidden-sm-and-up">
                <el-icon><Edit /></el-icon>发帖
              </el-dropdown-item>
            </template>
          </el-popover>
          <el-dropdown-item class="hidden-md-and-up">
            <el-icon><Menu /></el-icon>
            <router-link :to="{ name: RouteName.CATE_NAME }" title="分类"
              >分类</router-link
            >
          </el-dropdown-item>
          <el-dropdown-item divided @click="handleLogout">
            <i class="iconfont icon-logout"></i>退出
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <div v-else>
      <router-link :to="{ name: RouteName.LOGIN_NAME }">登录</router-link
      >&nbsp;/&nbsp;
      <router-link :to="{ name: RouteName.REGISTER_NAME }">注册</router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.edit-type-wrap {
  .title {
    text-align: center;
    padding: 10px 0 20px 0;
  }
  .rich-edit {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
  }
  .markdown-edit {
    display: flex;
    justify-content: center;
  }
}
.right_wrap {
  width: 70px;
  white-space: nowrap;
  display: flex;
  justify-content: flex-end;
  .avatar {
    height: 36px;
    width: 36px;
    object-fit: cover;
    border-radius: 50%;
  }
  .el-dropdown {
    margin-top: 3px;
  }
  a {
    &:hover {
      color: #409eff;
    }
  }
}
</style>
