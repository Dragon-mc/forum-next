import { StorageToken } from '@/enum/storage'
import type { PublishPostItem, DraftPostItem } from '@/types/post'

/**
 * 设置编辑帖子信息
 */
export function setEditPost(item: PublishPostItem | DraftPostItem) {
  window.sessionStorage.setItem(StorageToken.POST_EDIT_TOKEN, JSON.stringify(item))
}

/**
 * 获取编辑帖子信息
 */
export function getEditPost(): PublishPostItem | DraftPostItem | null {
  const post = window.sessionStorage.getItem(StorageToken.POST_EDIT_TOKEN)
  return post ? JSON.parse(post) : null
}

/**
 * 删除编辑帖子信息
 */
export function delEditPost() {
  window.sessionStorage.removeItem(StorageToken.POST_EDIT_TOKEN)
}