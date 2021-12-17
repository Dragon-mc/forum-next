<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { feedback } from '@/api/user'
import moment from 'moment'
import { DateFormat } from '@/enum'

const content = ref('')

const handleFeedback = async () => {
  if (content.value.trim() === '') {
    ElMessage.error({ message: '请输入反馈内容' })
    return
  }
  await feedback({
    content: content.value,
    time: moment().format(DateFormat.STANDER),
  })

  ElMessage.success({ message: '反馈成功' })
  content.value = ''
}
</script>

<script lang="ts"></script>

<template>
  <div class="feedback_wrap">
    <div class="title">意见反馈</div>
    <div class="input_wrap">
      <el-input
        v-model="content"
        placeholder="请输入要反馈的内容"
        type="textarea"
        rows="10"
        maxlength="300"
        show-word-limit
      ></el-input>
    </div>
    <div class="submit_feedback">
      <el-button type="primary" size="small" @click="handleFeedback"
        >提交反馈</el-button
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
.feedback_wrap {
  padding: 24px;
  .title {
    font-size: 16px;
    color: #222226;
    font-weight: bold;
  }
  .input_wrap {
    margin-top: 15px;
  }
  .submit_feedback {
    display: flex;
    justify-content: flex-end;
    padding-top: 20px;
  }
}
</style>
