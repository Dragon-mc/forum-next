<script setup lang="ts">
import { fromNow } from '@/utils/computed'
import { View, ChatDotRound } from '@element-plus/icons'
import type { CollectionPostItem as CollectionPostItemType } from '@/types/post'
import useCollection from '@/hooks/useCollectionPost'
import { RouteName } from '@/enum/route'

interface Props {
  collectionItem: CollectionPostItemType
}
defineProps<Props>()

const { handleCollection } = useCollection()
</script>

<template>
  <div class="collection_item">
    <el-row>
      <el-col :xs="21" :sm="21" :md="22" :lg="23" :xl="23" class="info_wrap">
        <div class="user_info">
          <div class="user_avatar">
            <router-link
              :to="{
                name: RouteName.USER_CENTER_NAME,
                params: { username: collectionItem.username },
              }"
            >
              <img v-src="collectionItem.avatar" />
            </router-link>
          </div>
          <div class="user_name">
            <router-link
              :to="{
                name: RouteName.USER_CENTER_NAME,
                params: { username: collectionItem.username },
              }"
              >{{
                collectionItem.nickname || collectionItem.username
              }}</router-link
            >
          </div>
          <div class="collection_time">
            {{ fromNow(collectionItem.time) }}
          </div>
        </div>
        <el-row class="post_info" :gutter="12">
          <el-col
            :xs="19"
            :sm="19"
            :md="20"
            :lg="20"
            :xl="20"
            class="info_left"
          >
            <div class="post_title">
              <router-link
                :to="{
                  name: RouteName.POST_NAME,
                  params: {
                    postId: collectionItem.id,
                    username: collectionItem.username,
                  },
                }"
                >{{ collectionItem.title }}</router-link
              >
            </div>
            <div class="post_content">
              {{ collectionItem.plain }}
            </div>
          </el-col>
          <el-col :xs="5" :sm="5" :md="4" :lg="4" :xl="4" class="info_right">
            <el-row :gutter="12">
              <el-col :sm="12" :md="12" :lg="12" :xl="12" class="read_num">
                <router-link
                  :to="{
                    name: RouteName.POST_NAME,
                    params: {
                      postId: collectionItem.id,
                      username: collectionItem.username,
                    },
                  }"
                  ><el-icon><View /></el-icon
                  >{{ collectionItem.read_times }}</router-link
                >
              </el-col>
              <el-col :sm="12" :md="12" :lg="12" :xl="12" class="comment_num">
                <router-link
                  :to="{
                    name: RouteName.POST_NAME,
                    params: {
                      postId: collectionItem.id,
                      username: collectionItem.username,
                    },
                  }"
                  ><el-icon><ChatDotRound /></el-icon
                  >{{ collectionItem.comment_times }}</router-link
                >
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
      <el-col
        :xs="3"
        :sm="3"
        :md="2"
        :lg="1"
        :xl="1"
        class="collection_operate"
      >
        <i
          class="iconfont"
          :class="
            collectionItem.is_collection
              ? 'icon-collection-b'
              : 'icon-collection'
          "
          @click="
            handleCollection(
              collectionItem.is_collection,
              collectionItem.id,
              () =>
                (collectionItem.is_collection = !collectionItem.is_collection)
            )
          "
        ></i>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.collection_item {
  .collection_operate {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 112px;
    .icon-collection-b {
      color: rgb(255, 204, 118);
    }
    .iconfont {
      cursor: pointer;
      font-size: 18px;
    }
  }
  margin-top: 15px;
  padding: 18px;
  border: 1px solid #ededed;
  border-radius: 10px;
  &:hover {
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
  }
  .user_info {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
    .user_avatar {
      img {
        width: 50px !important;
        height: 50px !important;
        object-fit: cover !important;
        border-radius: 8px !important;
      }
    }
    .user_name {
      font-weight: bold;
      padding-left: 20px;
      width: calc(100% - 120px);
      a {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        display: inline-block;
        width: 100%;
      }
    }
    .collection_time {
      flex: 1;
      text-align: right;
    }
  }
  .post_info {
    .info_left {
      .post_title {
        margin-bottom: 10px;
        a {
          width: 100%;
          display: inline-block;
          font-size: 18px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-weight: bold;
          &:link {
            color: #3d3d3d;
          }
          &:visited {
            color: #b8b8b8;
          }
          &:hover {
            color: #409eff;
          }
        }
      }
      .post_content {
        color: #8a8a8a;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .info_right {
      height: 53px;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      align-items: flex-end;
      i {
        font-size: 18px;
        margin-right: 3px;
        font-weight: bold;
        color: #6b6b6b;
      }
      a {
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
        &:hover {
          color: #409eff;
        }
      }
    }
  }
}
</style>
