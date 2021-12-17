const homeRouter = require('koa-router')()
const {
  fetchRecommendPostList,
  fetchCarouselList,
  fetchRankList,
  fetchCateList,
  fetchBrowseRank,
  fetchCommentRank,
  fetchAttentionRank,
} = require('../../controllers/front/home')

// 获取首页推荐列表信息
homeRouter.get('/fetch_recommend_post_list', fetchRecommendPostList)

// 获取轮播图列表
homeRouter.get('/fetch_carousel_list', fetchCarouselList)

// 获取首页首页排行榜列表
homeRouter.get('/fetch_rank_list', fetchRankList)

// 获取分类列表
homeRouter.get('/fetch_cate_list', fetchCateList)

// 获取浏览排行列表
homeRouter.get('/fetch_browse_rank', fetchBrowseRank)

// 获取评论排行列表
homeRouter.get('/fetch_comment_rank', fetchCommentRank)

// 获取关注排行列表
homeRouter.get('/fetch_attention_rank', fetchAttentionRank)

module.exports = homeRouter
