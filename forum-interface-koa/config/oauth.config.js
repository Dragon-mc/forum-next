const appConfig = require('./app.config')

module.exports = {
  github: {
    accessTokenUrl: 'https://github.com/login/oauth/access_token',
    userInfoUrl: 'https://api.github.com/user',
    params: {
      client_secret: 'd255007c8ec60a3f5e02fecfb18218ef891be5a3',
      client_id: 'c6aec6949124634fb1f2',
    }
  },
  gitee: {
    accessTokenUrl: 'https://gitee.com/oauth/token',
    userInfoUrl: 'https://gitee.com/api/v5/user',
    params: {
      client_secret: '87726251f6da852442d0562d38d2833920b6861962ab2510d2f412e60ccd910c',
      client_id: 'f2ef2a7a109c895d73a556f73459c1286345fa5f727b9ab0f7e406e142314c76',
      grant_type: 'authorization_code',
      redirect_uri: `${appConfig.baseUrl}/oauth/gitee`
    }
  }
}