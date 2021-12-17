const Mysql = require('../lib/mysql')
const dbConfig = require('../config/db.config')
const { getNodeEnv } = require('../utils')

const db = new Mysql(dbConfig[getNodeEnv()])

module.exports = db