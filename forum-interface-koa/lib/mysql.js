/**
 * 数据库操作 mysql.js
 */

const mysql = require('mysql')
const placeArray = []

class Mysql {
  constructor(config) {
    this.handleConnect(config)
  }

  handleConnect(config) {
    const pool = mysql.createPool(config)
    this.mysql = pool
  }

  /**
   * select 查询第一条数据
   *
   * @param {String} query 查询语句
   * @returns {Array} 查看出的所有记录结果数组
   */
  async select(query, dataArray) {
    if (!Array.isArray(dataArray)) {
      dataArray = placeArray
    }
    const res = await new Promise((resolve, reject) => {
      this.mysql.getConnection((err, connection) => {
        if (err) {
          reject(err)
          return
        }
        connection.query(query, dataArray, function (error, results) {
          if (error) {
            reject(error)
          } else {
            resolve(results)
          }
          connection.release()
        })
      })
    }).catch((err) => {
      throw new Error(err)
    })
    return res
  }

  /**
   * find 查询第一条数据
   *
   * @param {String} query 查询语句
   * @returns {Object} 查看出的记录结果
   */
  async find(query, dataArray) {
    if (!Array.isArray(dataArray)) {
      dataArray = placeArray
    }
    let res = await new Promise((resolve, reject) => {
      this.mysql.getConnection((err, connection) => {
        if (err) {
          reject(err)
          return
        }
        connection.query(query, dataArray, function (error, results) {
          if (error) {
            reject(error)
          } else {
            resolve(results.length > 0 ? results[0] : false)
          }
          connection.release()
        })
      })
    }).catch((err) => {
      throw new Error(err)
    })
    return res
  }

  /**
   * insert 插入数据
   *
   * @param {String} table 要插入的表
   * @param {Object} arrayDataValue 要插入的数据对象
   * @param {Boolean} allowFields 是否对插入数据进行过滤
   * @returns {Boolean} 插入是否成功（对数据库是否造成影响）
   */
  async insert(table, arrayDataValue, allowFields = false) {
    if (allowFields) {
      arrayDataValue = await this.fieldsFilter(table, arrayDataValue)
    }
    let sqlStr = `INSERT INTO \`${table}\` SET ?`
    let res = await new Promise((resolve, reject) => {
      this.mysql.getConnection((err, connection) => {
        if (err) {
          reject(err)
          return
        }
        connection.query(sqlStr, arrayDataValue, function (error, results) {
          if (error) {
            reject(error)
          } else {
            resolve(results)
          }
          connection.release()
        })
      })
    }).catch((err) => {
      throw new Error(err)
    })
    return res.affectedRows ? true : false
  }

  /**
   * update 更新数据
   *
   * @param {String} table 要插入的表
   * @param {Object} arrayDataValue 要插入的数据对象
   * @param {String} where 更新的条件
   * @param {Boolean} allowFields 是否对插入数据进行过滤
   * @returns {Boolean} 更新是否成功（对数据库是否造成影响）
   */
  async update(table, arrayDataValue, where = '', allowFields = false) {
    if (allowFields) {
      arrayDataValue = await this.fieldsFilter(table, arrayDataValue)
    }
    if (where != '') {
      where = 'WHERE ' + where
    } else {
      // 没有where的update操作直接不处理
      return false
    }
    let sqlStr = `UPDATE \`${table}\` SET ? ${where}`
    let res = await new Promise((resolve, reject) => {
      this.mysql.getConnection((err, connection) => {
        if (err) {
          reject(err)
          return
        }
        connection.query(sqlStr, arrayDataValue, function (error, results) {
          if (error) {
            reject(error)
          } else {
            resolve(results)
          }
          connection.release()
        })
      })
    }).catch((err) => {
      throw new Error(err)
    })
    return res.affectedRows ? true : false
  }

  /**
   * delete 删除
   *
   * @param {String} table 表名
   * @param {String} where 条件
   * @returns {Boolean} 删除是否成功（对数据库是否造成影响）
   */
  async delete(table, where = '', dataArray) {
    if (!Array.isArray(dataArray)) {
      dataArray = placeArray
    }
    let res = await new Promise((resolve, reject) => {
      this.mysql.getConnection((err, connection) => {
        if (err) {
          reject(err)
          return
        }
        if (where === '') {
          reject('delete operate need where params')
        } else {
          let sqlStr = `DELETE FROM \`${table}\` WHERE ${where}`
          connection.query(sqlStr, dataArray, function (error, results) {
            if (error) {
              reject(error)
            } else {
              resolve(results)
            }
            connection.release()
          })
        }
      })
    }).catch((err) => {
      throw new Error(err)
    })
    return res.affectedRows ? true : false
  }

  /**
   * count 计算记录数
   *
   * @param {String} table 表名
   * @param {String} where 条件
   * @returns {Number} 记录总数
   */
  async count(table, where = '', dataArray) {
    if (where !== '') {
      where = 'WHERE ' + where
    }
    let res = await this.find(
      `SELECT count(*) as total FROM \`${table}\` ${where}`,
      dataArray
    )
    return parseInt(res['total'])
  }

  /**
   * fieldsFilter 过滤掉数据表字段中不存在的数据
   *
   * @param {String} table
   * @param {Object} arrayField
   * @returns {Object}
   */
  async fieldsFilter(table, arrayFields) {
    let fields = await this.getFields(table)
    for (let key in arrayFields) {
      if (!fields.includes(key)) {
        delete arrayFields[key]
      }
    }
    return arrayFields
  }

  /**
   * getFields 获取指定数据表中的全部字段名
   *
   * @param {String} $table 表名
   * @returns {Array} 表中的字段数组
   */
  async getFields(table) {
    let res = await new Promise((resolve, reject) => {
      this.mysql.getConnection((err, connection) => {
        if (err) {
          reject(err)
          return
        }
        connection.query(
          `SHOW COLUMNS FROM \`${table}\``,
          function (error, results) {
            if (error) {
              reject(error)
            } else {
              resolve(results)
            }
            connection.release()
          }
        )
      })
    }).catch((err) => {
      throw new Error(err)
    })
    return res.map((v) => v.Field)
  }
}

module.exports = Mysql
