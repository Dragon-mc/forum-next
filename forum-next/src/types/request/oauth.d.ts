export interface oauthType {
  type: string
}

export interface oauthRequest extends oauthType {
  code: string
}
