import type { ThirdPartyType, oauthType } from '@/types/oauth'

const ThirdParty: ThirdPartyType = {
  github: {
    url: 'https://github.com/login/oauth/authorize',
    params: {
      client_id: 'c6aec6949124634fb1f2',
      redirect_uri: import.meta.env.VITE_FRONT_BASE + '/oauth/github'
    }
  },
  gitee: {
    url: 'https://gitee.com/oauth/authorize',
    params: {
      client_id: 'f2ef2a7a109c895d73a556f73459c1286345fa5f727b9ab0f7e406e142314c76',
      redirect_uri: import.meta.env.VITE_FRONT_BASE + '/oauth/gitee',
      response_type: 'code'
    }
  }
}

export const thirdPartyList: Array<{
  id: number,
  name: oauthType,
  iconfont: string,
  color: string
}> = [
  { id: 1, name: 'github', iconfont: 'icon-github', color: 'rgb(161,216,133)' },
  { id: 2, name: 'gitee', iconfont: 'icon-gitee', color: 'rgb(199,29,35)' },
]

export const thirdPartyMap: {
  [key in oauthType]: boolean
} = {
  'github': true,
  'gitee': true,
}

export default ThirdParty