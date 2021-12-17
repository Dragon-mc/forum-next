export interface requestLogin {
  username: string
  password: string
  vcode: string
  token: string
}

export interface requestRegister extends requestLogin {
  rePassword: string
  create_time: string
}

export interface requestRereshToken {
  token: string
}

export interface requestCancelAttention {
  passive_id: string | number
}

export interface requestAttention extends requestCancelAttention {
  time: string
}

export interface requestCancelCollection {
  post_id: string | number
}

export interface requestCollection extends requestCancelCollection {
  time: string
}

export type requestHistory = requestCollection

export interface requestFeedback {
  content: string
  time: string
}

export interface requestModifyPassword extends Pick<requestRegister, 'password' | 'rePassword'> {
  newPassword: string
}
