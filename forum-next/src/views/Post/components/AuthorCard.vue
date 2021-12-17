<script setup lang="ts">
import type { PostDetailInfo } from '@/types/post'
import useAttentionUser from '@/hooks/useAttentionUser'
import { RouteName } from '@/enum/route'

interface Props {
  postInfo: PostDetailInfo | null
}
defineProps<Props>()
const emit = defineEmits<{
  (e: 'fans-change', value: number): void
}>()

const { handleAttention } = useAttentionUser()
const handleAttentionUser = async (
  ...args: [
    isAttention: boolean | undefined,
    passiveId: number | string | undefined,
    changeState: Function
  ]
) => {
  const res = await handleAttention(...args)
  if (res) {
    let value = -1
    res.attention && (value = 1)
    emit('fans-change', value)
  }
}
</script>

<template>
  <div class="author_info">
    <el-row>
      <el-col :xs="4" :sm="3" :md="8" :lg="8" :xl="8" class="author_avatar">
        <router-link
          :to="{
            name: RouteName.USER_CENTER_NAME,
            params: { username: postInfo?.user_info?.username || '0' },
          }"
          ><img v-src="postInfo?.user_info?.avatar"
        /></router-link>
      </el-col>
      <el-col :xs="5" :sm="4" :md="16" :lg="16" :xl="16" class="author_name">
        <router-link
          :to="{
            name: RouteName.USER_CENTER_NAME,
            params: { username: postInfo?.user_info?.username || '0' },
          }"
          >{{
            postInfo?.user_info?.nickname || postInfo?.user_info?.username
          }}</router-link
        >
      </el-col>
      <el-col :xs="15" :sm="17" :md="24" :lg="24" :xl="24" class="author_sign">
        {{ postInfo?.user_info?.sign || '这个人很懒，什么都没留下' }}
      </el-col>
    </el-row>
    <div class="line-box"></div>
    <div class="interactive">
      <div class="attention">
        <el-col :xs="12" :sm="12" :md="24" :lg="24" :xl="24" class="num">{{
          postInfo?.user_info?.attention_num
        }}</el-col>
        <el-col :xs="12" :sm="12" :md="24" :lg="24" :xl="24" class="txt"
          >关注</el-col
        >
      </div>
      <div class="fans">
        <el-col :xs="12" :sm="12" :md="24" :lg="24" :xl="24" class="num">{{
          postInfo?.user_info?.fans_num
        }}</el-col>
        <el-col :xs="12" :sm="12" :md="24" :lg="24" :xl="24" class="txt"
          >粉丝</el-col
        >
      </div>
      <div class="comment">
        <el-col :xs="12" :sm="12" :md="24" :lg="24" :xl="24" class="num">{{
          postInfo?.user_info?.comment_num
        }}</el-col>
        <el-col :xs="12" :sm="12" :md="24" :lg="24" :xl="24" class="txt"
          >评论</el-col
        >
      </div>
      <div class="collection">
        <el-col :xs="12" :sm="12" :md="24" :lg="24" :xl="24" class="num">{{
          postInfo?.user_info?.collection_num
        }}</el-col>
        <el-col :xs="12" :sm="12" :md="24" :lg="24" :xl="24" class="txt"
          >收藏</el-col
        >
      </div>
    </div>
    <div class="attention_author">
      <div v-if="postInfo?.user_info?.self"></div>
      <div
        class="btn"
        v-else-if="!postInfo?.user_info?.is_attention"
        @click="
          handleAttentionUser(
            postInfo?.user_info?.is_attention,
            postInfo?.user_id,
            () =>
              postInfo &&
              (postInfo.user_info.is_attention =
                !postInfo?.user_info?.is_attention)
          )
        "
      >
        关注作者
      </div>
      <div
        class="has_at"
        v-else
        @click="
          handleAttentionUser(
            postInfo?.user_info?.is_attention,
            postInfo?.user_id,
            () =>
              postInfo &&
              (postInfo.user_info.is_attention =
                !postInfo.user_info?.is_attention)
          )
        "
      >
        取消关注
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.author_info {
  background: #fff;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 12px;
  .author_avatar {
    height: 50px;
    img {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 50%;
    }
  }
  .author_name {
    height: 50px;
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    color: #555666;
  }
  .author_sign {
    height: 50px;
    line-height: 50px;
    color: #4a4d52;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .line-box {
    height: 1px;
    background-color: #f5f6f7;
    margin-top: 10px;
  }
  .interactive {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 70px;
    color: #999aaa;
    .num {
      margin-bottom: 5px;
      color: #555666;
      display: flex;
      justify-content: center;
    }
    .txt {
      display: flex;
      justify-content: center;
      white-space: nowrap;
    }
  }
  .attention_author {
    display: flex;
    justify-content: center;
    align-items: center;
    .btn,
    .has_at {
      color: #fff;
      background: linear-gradient(45deg, #c9afff, #409eff);
      width: 100px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 15px;
      margin: 8px 0;
      &:hover {
        cursor: pointer;
        opacity: 0.9;
      }
    }
    .has_at {
      border: 1px solid #999999;
      background: #fff;
      color: #333;
      &:hover {
        color: #409eff;
        cursor: pointer;
        border: 1px solid #409eff;
        background: rgba(64, 158, 255, 0.1);
      }
    }
  }
}
</style>
