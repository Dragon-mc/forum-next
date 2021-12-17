<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import usePaginationModel from '@/hooks/usePaginationModel'
import useCommentInfo from '../composables/useCommentInfo'
import { fromNow } from '@/utils/computed'
import { getUserInfo } from '@/utils/auth'
import { comment, reply } from '@/api/post'
import { checkLogin } from '@/utils/auth'
import moment from 'moment'
import type { PostCommentItem, PostCommentReplyItem } from '@/types/post'
import type { requestPostReply } from '@/types/request/post'
import { RouteName } from '@/enum/route'
import { DateFormat } from '@/enum'

interface Props {
  postId: number | string
}
const { postId } = defineProps<Props>()

const selfInfo = getUserInfo()
const commentInput = ref<HTMLInputElement | null>(null)

// 评论分页
const { paginationData, total, loading, handlePageChange } =
  usePaginationModel(10)

// 评论信息
const {
  commentInfo,
  commentContent,
  getCommentInfo,
  commentPlaceholder,
  isReply,
  restCommentState,
} = useCommentInfo(postId, paginationData, total)
defineExpose({ restCommentState })

const replyCreateData: requestPostReply = {
  passive_user_id: '',
  comment_id: '',
  time: '',
  content: 'string'
}

// 点击评论
const handleComment = async () => {
  if (!checkLogin()) return
  if (commentContent.value.trim() === '') {
    ElMessage.error({ message: '请输入评论内容' })
    return
  }
  if (!isReply.value) {
    // 当前为评论状态
    await comment({
      post_id: postId,
      content: commentContent.value,
      time: moment().format(DateFormat.STANDER),
    })
    ElMessage.success({ message: '评论成功' })
  } else {
    // 当前为回复状态
    const data = Object.assign(replyCreateData, { content: commentContent.value })
    await reply(data)
    ElMessage.success({ message: '回复成功' })
  }
  commentContent.value = ''
  // 重新获取评论列表，刷新评论列表
  getCommentInfo()
}

// 回复
const handleReply = (
  item: PostCommentItem | PostCommentReplyItem,
  commentItem: PostCommentItem | void
) => {
  if (!checkLogin()) return
  commentPlaceholder.value = '回复@' + (item.nickname || item.username)
  // 使评论输入框聚焦
  commentInput.value && commentInput.value.focus()
  // 改变当前的状态为 回复状态
  isReply.value = true
  Object.assign(replyCreateData, {
    passive_user_id: item.user_id,
    // 如果存在评论的对象，则使用评论对象中的id，表示当前是点击回复内容后面 回复按钮进入的函数
    comment_id: commentItem ? commentItem.id : item.id,
    time: moment().format(DateFormat.STANDER),
  })
}
</script>

<template>
  <div class="comment_wrap">
    <div class="title">评论区</div>
    <div class="my_comment_wrap">
      <div class="my_avatar">
        <img v-src="selfInfo?.avatar" />
      </div>
      <div class="input">
        <el-input
          ref="commentInput"
          v-model="commentContent"
          :placeholder="commentPlaceholder"
          @keyup.native.enter="handleComment"
          @click.native.stop="1"
        >
        </el-input>
      </div>
      <div class="submit_btn">
        <el-button @click.stop.prevent="handleComment">评论</el-button>
      </div>
    </div>
    <div class="comment_list" v-if="commentInfo.length">
      <div
        class="comment_item"
        v-for="commentItem in commentInfo"
        :key="commentItem.id"
      >
        <div class="comment_content_wrap">
          <div class="user_avatar">
            <router-link
              :to="{
                name: RouteName.USER_CENTER_NAME,
                params: { username: commentItem.username },
              }"
              ><img
                v-src="commentItem.avatar"
                alt=""
            /></router-link>
          </div>
          <div class="user_name">
            <router-link
              :to="{
                name: RouteName.USER_CENTER_NAME,
                params: { username: commentItem.username },
              }"
              >{{ commentItem.nickname || commentItem.username }}：</router-link
            >
          </div>
          <div class="comment_content">
            {{ commentItem.content }}
            <span class="time">{{ fromNow(commentItem.time) }}</span>
            <span class="reply" @click.stop.prevent="handleReply(commentItem)"
              >回复</span
            >
          </div>
        </div>
        <div class="reply_list">
          <div class="gap"></div>
          <div class="reply_item_wrap">
            <div
              class="reply_item"
              v-for="replyItem in commentItem.reply_info"
              :key="replyItem.id"
            >
              <div class="user_avatar">
                <router-link
                  :to="{
                    name: RouteName.USER_CENTER_NAME,
                    params: { username: replyItem.username },
                  }"
                  ><img
                    v-src="replyItem.avatar"
                    alt=""
                /></router-link>
              </div>
              <div class="user_name">
                <router-link
                  :to="{
                    name: RouteName.USER_CENTER_NAME,
                    params: { username: replyItem.username },
                  }"
                  >{{ replyItem.nickname || replyItem.username }}&nbsp;回复<span
                    class="reply_name"
                    >@{{ replyItem.passive_nickname }}</span
                  >：</router-link
                >
              </div>
              <div class="comment_content">
                {{ replyItem.content }}
                <span class="time">{{ fromNow(replyItem.time) }}</span>
                <span
                  class="reply"
                  @click.stop.prevent="handleReply(replyItem, commentItem)"
                  >回复</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination" v-if="total > paginationData.limit">
        <el-pagination
          @current-change="handlePageChange($event, getCommentInfo)"
          :current-page="paginationData.page"
          :page-size="paginationData.limit"
          layout="prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <div class="no-content" v-else>暂无评论...</div>
  </div>
</template>

<style lang="scss" scoped>
.comment_wrap {
  margin: 12px 0 24px 0;
  background: #fff;
  padding: 25px;
  border-radius: 12px;
  .title {
    font-size: 18px;
    color: #20232c;
    font-weight: bolder;
    padding-bottom: 10px;
  }
  .my_comment_wrap {
    display: flex;
    padding: 10px 0;
    border-bottom: 1px solid #e8e8ee;
    .my_avatar {
      img {
        width: 40px;
        height: 40px;
        object-fit: cover;
        border-radius: 50%;
      }
    }
    .input {
      width: 100%;
      margin-left: 15px;
    }
    .submit_btn {
      margin-left: 15px;
    }
  }
  .no-content {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #999aaa;
    margin-top: 20px;
    font-size: 16px;
  }
  .comment_list {
    // padding: 15px 0 0 0;
    .comment_item {
      border-bottom: 1px solid #e8e8ee;
      padding: 10px 0;
      @mixin attr {
        display: flex;
        .user_avatar {
          img {
            width: 25px;
            height: 25px;
            object-fit: cover;
            border-radius: 50%;
          }
        }
        .user_name {
          color: #555666;
          line-height: 24px;
          padding-left: 10px;
        }
        .comment_content {
          padding-left: 5px;
          color: #222226;
          line-height: 24px;
          .time {
            font-size: 12px;
            color: #6b6b6b;
            padding-left: 12px;
          }
          .reply {
            color: #409eff;
            padding-left: 10px;
            cursor: pointer;
            &:hover {
              color: #fc5531;
            }
          }
        }
      }
      .comment_content_wrap {
        padding: 7px 0;
        @include attr;
      }
      &:last-child {
        border: none;
      }
      .reply_list {
        display: flex;
        .gap {
          width: 35px;
        }
        .reply_item_wrap {
          .reply_item {
            padding: 7px 0;
            @include attr;
            .reply_name {
              color: #409eff;
            }
          }
        }
      }
    }

    .pagination {
      .el-pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px 0 0 0;
      }
    }
  }
}
</style>
