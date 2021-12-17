<script setup lang="ts">
import { toRef } from 'vue'
import { UploadFilled } from '@element-plus/icons'
import type { UserCenterInfo } from '@/types/user'
import userAvatarUploader from '../composables/useAvatarUploader'
interface Props {
  userInfo: UserCenterInfo
}
const props = defineProps<Props>()
const {
  avatarUploaderVisible,
  fileList,
  showUpload,
  uploader,
  handleUploaderStateChange,
  handleRequestUpload,
  handleDialogOpen,
} = userAvatarUploader(toRef(props, 'userInfo'))
</script>

<template>
  <div class="user_avatar">
    <img v-src="userInfo.avatar" />
    <p
      v-if="userInfo.self"
      class="modify_img"
      @click="avatarUploaderVisible = true"
    >
      上传头像
    </p>
  </div>
  <el-dialog
    title="上传头像"
    v-model="avatarUploaderVisible"
    width="500px"
    @open="handleDialogOpen"
    @close="handleDialogOpen"
  >
    <el-upload
      class="upload-wrap"
      ref="uploader"
      :drag="!showUpload"
      action="https://jsonplaceholder.typicode.com/posts/"
      :auto-upload="false"
      :file-list="fileList"
      list-type="picture"
      :limit="1"
      :on-change="handleUploaderStateChange"
      :on-remove="() => (showUpload = false)"
      :http-request="handleRequestUpload"
    >
      <div v-show="!showUpload">
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </div>
      <div v-show="!showUpload" class="el-upload__tip" slot="tip">
        只能上传jpg/png文件，且不超过2MB
      </div>
    </el-upload>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="avatarUploaderVisible = false" size="small"
          >取 消</el-button
        >
        <el-button
          style="margin-left: 10px"
          size="small"
          type="primary"
          @click="uploader.submit()"
          v-show="showUpload"
          >上传并保存</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.user_avatar {
  margin: 0 40px;
  position: relative;
  border-radius: 50%;
  overflow: hidden;
  img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 50%;
  }
  .modify_img {
    color: #fff;
    font-size: 12px;
    text-align: center;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 80px;
    height: 24px;
    line-height: 24px;
    background: rgba(0, 0, 0, 0.8);
    opacity: 0;
    transition-duration: 0.2s;
  }
  &:hover {
    cursor: pointer;
    .modify_img {
      opacity: 1;
    }
  }
}
.upload-wrap {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
