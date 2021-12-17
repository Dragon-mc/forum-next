<script setup lang="ts">
import type { UserRelationItem as UserRelationItemType } from '@/types/user'
import useAttentionUser from '@/hooks/useAttentionUser'
import { RouteName } from '@/enum/route'

interface Props {
  relationItem: UserRelationItemType
}
defineProps<Props>()

const { handleAttention } = useAttentionUser()
</script>

<template>
  <el-row class="user-relation-item">
    <el-col :xs="5" :sm="3" :md="2" :lg="2" :xl="2" class="avatar">
      <router-link
        :to="{
          name: RouteName.USER_CENTER_NAME,
          params: { username: relationItem.username },
        }"
      >
        <img v-src="relationItem.avatar" />
      </router-link>
    </el-col>
    <el-col :xs="13" :sm="17" :md="20" :lg="20" :xl="20" class="name_sign">
      <router-link
        :to="{
          name: RouteName.USER_CENTER_NAME,
          params: { username: relationItem.username },
        }"
        class="name"
      >
        {{ relationItem.nickname || relationItem.username }}
      </router-link>
      <router-link
        :to="{
          name: RouteName.USER_CENTER_NAME,
          params: { username: relationItem.username },
        }"
        class="sign"
      >
        {{ relationItem.sign || '这个人很懒，什么都没写上' }}
      </router-link>
    </el-col>
    <el-col :xs="6" :sm="4" :md="2" :lg="2" :xl="2" class="attention">
      <div v-if="relationItem.self" class="btn at_btn">self</div>
      <div
        v-else-if="relationItem.is_attention"
        class="btn"
        :class="{ no_atte: false }"
        @click="
          handleAttention(
            relationItem.is_attention,
            relationItem.id,
            () => (relationItem.is_attention = !relationItem.is_attention)
          )
        "
      >
        取消关注
      </div>
      <div
        v-else
        class="btn at_btn"
        :class="{ no_atte: false }"
        @click="
          handleAttention(
            relationItem.is_attention,
            relationItem.id,
            () => (relationItem.is_attention = !relationItem.is_attention)
          )
        "
      >
        关注TA
      </div>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.user-relation-item {
  height: 82px;
  border-top: 1px solid #e0e0e0;
  .avatar {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      height: 50px;
      width: 50px;
      border-radius: 50%;
    }
  }
  .name_sign {
    height: 100%;
    padding: 10px 20px 10px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    a {
      color: #4d4d4d;
      width: 100%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      &:hover {
        color: #409eff;
      }
    }
    .name {
      font-size: 16px;
      font-weight: bold;
    }
    .sign {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .attention {
    height: 100%;
    color: #999999;
    display: flex;
    justify-content: center;
    align-items: center;
    .btn {
      width: 90px;
      height: 32px;
      border-radius: 16px;
      border: 1px solid #999999;
      display: flex;
      justify-content: center;
      align-items: center;
      &:hover {
        color: #409eff;
        cursor: pointer;
        border: 1px solid #409eff;
        background: rgba(64, 158, 255, 0.1);
      }
    }
    .at_btn {
      background: #409eff;
      color: #fff;
      border: 1px solid #409eff;
      &:hover {
        opacity: 0.8;
        background: #409eff;
        color: #fff;
      }
    }
    .no_atte {
      border: 1px solid #409eff;
      color: #409eff;
    }
  }
}
</style>
