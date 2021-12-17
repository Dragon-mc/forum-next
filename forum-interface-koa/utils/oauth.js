const oauthConfig = require('../config/oauth.config')
const axios = require('axios')

const tokenHandler = {
  github(data) {
    if (data.error) {
      return {
        success: false
      }
    }
    return {
      success: true,
      token: data.access_token
    }
  },
  gitee(data) {
    return this.github(data)
  }
}

const userInfoHandler = {
  async github(url, token) {
    const { data: userInfo } = await axios({
      method: 'get',
      url,
      headers: {
        'Authorization': `token ${token}`
      }
    })
    return {
      id: userInfo.id,
      avatar_url: userInfo.avatar_url,
      name: userInfo.name
    }
  },
  async gitee(url, token) {
    const { data: userInfo } = await axios({
      method: 'get',
      url,
      params: {
        access_token: token
      }
    })
    return {
      id: userInfo.id,
      avatar_url: userInfo.avatar_url,
      name: userInfo.name
    }
  }
}

module.exports = class Oauth {

  constructor(code, type) {
    this.code = code
    this.config = oauthConfig[type]
    this.type = type
  }

  async getToken(bind) {
    const { params } = this.config
    const requestParams = Object.assign({}, params)
    requestParams.code = this.code
    // 处理gitee中redirect_uri的问题
    if (bind && requestParams.redirect_uri) requestParams.redirect_uri += '?type=bind'
    console.log(requestParams)
    try {
      const { data } = await axios({
        method: 'post',
        url: this.config.accessTokenUrl,
        headers: {
          'Accept': 'application/json'
        },
        params: requestParams
      })
      return tokenHandler[this.type](data)
    } catch (e) {
      return { success: false }
    }
  }

  async getUserInfo(token) {
    try {
      const info = await userInfoHandler[this.type](this.config.userInfoUrl, token)
      return {
        success: true,
        info
      }
    } catch (e) {
      return { success: false }
    }
  }
}