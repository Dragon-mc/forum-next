<script setup lang="ts">
import RankList from './RankList.vue'
import BrowseRankItem from './BrowseRankItem.vue'
import CommentRankItem from './CommentRankItem.vue'
import AttentionRankItem from './AttentionRankItem.vue'
import type {
  BrowseRankItemType,
  CommentRankItemType,
  AttentionRankItemType,
} from '@/types/rank'
import { RouteName } from '@/enum/route'
import { RankType } from '@/enum/rank'

interface Props {
  browseRank: Array<BrowseRankItemType>
  commentRank: Array<CommentRankItemType>
  attentionRank: Array<AttentionRankItemType>
}
defineProps<Props>()
</script>

<template>
  <RankList
    title="浏览排行"
    :to-link="{
      name: RouteName.RANK_NAME,
      params: { rankType: RankType.BROWSE_TYPE },
    }"
  >
    <template v-for="item in browseRank">
      <BrowseRankItem :rank-item="item" />
    </template>
  </RankList>
  <RankList
    title="评论排行"
    :to-link="{
      name: RouteName.RANK_NAME,
      params: { rankType: RankType.COMMENT_TYPE },
    }"
  >
    <template v-for="item in commentRank">
      <CommentRankItem :rank-item="item" />
    </template>
  </RankList>
  <RankList
    title="关注排行"
    :to-link="{
      name: RouteName.RANK_NAME,
      params: { rankType: RankType.ATTENTION_TYPE },
    }"
  >
    <template v-for="item in attentionRank">
      <AttentionRankItem :rank-item="item" />
    </template>
  </RankList>
</template>

<style lang="scss" scoped></style>
