export enum RouteName {
  LOGIN_NAME = 'Login',
  OAUTH_NAME = 'Oauth',
  REGISTER_NAME = 'Register',
  HOME_NAME = 'Home',
  CATE_NAME = 'Cate',
  POST_NAME = 'Post',
  USER_CENTER_NAME = 'UserCenter',
  USER_PROFILE_NAME = 'Profile',
  USER_COLLECTION_NAME = 'Collection',
  USER_PUBLISH_NAME = 'UserPublish',
  USER_DRAFT_NAME = 'Draft',
  USER_ATTENTION_NAME = 'Attention',
  USER_FANS_NAME = 'Fans',
  USER_HISTORY_NAME = 'History',
  USER_FEEDBACK_NAME = 'Feedback',
  EDIT_NAME = 'Editor',
  RANK_NAME = 'Rank',
  SEARCH_NAME = 'Search',
  PAGE_404 = 'Page404'
}

export enum EditorRoute {
  MARKDOWN_NAME = 'markdown',
  RICH_TEXT_NAME = 'richtext'
}

export const PREFIX = 'TYPE_'
export enum TypeToEditor {
  TYPE_1 = EditorRoute.RICH_TEXT_NAME,
  TYPE_2 = EditorRoute.MARKDOWN_NAME
}

export const EditorToType: {
  [EditorRoute.RICH_TEXT_NAME]: 1,
  [EditorRoute.MARKDOWN_NAME]: 2
} = {
  [EditorRoute.RICH_TEXT_NAME]: 1,
  [EditorRoute.MARKDOWN_NAME]: 2
}
