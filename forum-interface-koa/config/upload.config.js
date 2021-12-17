const appConfig = require('./app.config')

/**
 * 文件上传信息配置
 */

 let path = require('path')

 module.exports = {
 
   'development': {
    "domain": "http://127.0.0.1:3001",
 
    "absolute_path": path.dirname(__dirname),
 
    'shareDir': 'public'
   },

   'production': {
    "domain": `${appConfig.baseUrl}:3000`,
 
    "absolute_path": path.dirname(__dirname),
 
    'shareDir': 'public'
   }
 
 }