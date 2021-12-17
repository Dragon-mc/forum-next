export type oauthType = 'github' | 'gitee'

export type ThirdPartyType = {
  [key in oauthType]: {
    url: string
    params: { [attr: string]: string }
  }
}
