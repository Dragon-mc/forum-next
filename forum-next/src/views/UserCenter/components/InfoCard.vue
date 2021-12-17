<script setup lang="ts">
import AvatarUploader from './AvatarUploader.vue'
import useInfoCard from '../composables/useInfoCard'
import useAttention from '@/hooks/useAttentionUser'
import type { UserCenterInfo } from '@/types/user'
import { EditorRoute } from '@/enum/route'

interface Props {
  userInfo: UserCenterInfo
}
defineProps<Props>()

const { editType } = useInfoCard()
const { handleAttention } = useAttention()
</script>

<template>
  <div class="info_card">
    <div class="inner my-container">
      <div class="left_info_wrap">
        <AvatarUploader :user-info="userInfo" />
        <div class="user_info">
          <div class="name">
            {{ userInfo.nickname || userInfo.username }}
          </div>
          <div class="interactive">
            关注<span class="attention">{{ userInfo.attention_num }}</span>
            粉丝<span class="fans">{{ userInfo.fans_num }}</span>
          </div>
        </div>
      </div>
      <div class="attention_wrap" v-if="!userInfo.self">
        <div
          class="at_btn"
          v-if="!userInfo.is_attention"
          @click="
            handleAttention(
              userInfo.is_attention,
              userInfo.id,
              () => (userInfo.is_attention = !userInfo.is_attention)
            )
          "
        >
          关注此人
        </div>
        <div
          class="has_at_btn"
          v-else
          @click="
            handleAttention(
              userInfo.is_attention,
              userInfo.id,
              () => (userInfo.is_attention = !userInfo.is_attention)
            )
          "
        >
          取消关注
        </div>
      </div>
      <div class="attention_wrap" v-else>
        <el-popover placement="bottom">
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
            <div class="at_btn">发帖</div>
          </template>
        </el-popover>
      </div>
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
.info_card {
  height: 150px;
  background: linear-gradient(45deg, #020031, #6d3353);
  .inner {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left_info_wrap {
      display: flex;
      align-items: center;
      .user_info {
        color: #fff;
        .name {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .interactive {
          .attention {
            margin-right: 10px;
            padding-left: 6px;
          }
          .fans {
            padding-left: 6px;
          }
        }
      }
    }
    .attention_wrap {
      padding-right: 30px;
      div {
        height: 30px;
        border-radius: 15px;
        width: 80px;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
      .at_btn {
        background: #409eff;
        &:hover {
          opacity: 0.9;
        }
      }
      .has_at_btn {
        border: 1px solid #267dcc;
        &:hover {
          background: rgba(41, 149, 255, 0.1);
        }
      }
    }
  }
}
</style>
