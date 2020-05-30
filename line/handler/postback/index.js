const _ = require('lodash')
const fs = require('fs')
const path = require('path')

module.exports = async ({ req, event, line, ga }) => {
  // 解析參數
  const [fn, ...args] = JSON.parse(_.get(event, 'postback.data', '[]'))

  if (!_.isString(fn) || !fn) return // 如果沒有指定 fn 就直接結束
  const fnPath = path.resolve(__dirname, `${fn}.js`)
  if (!fs.existsSync(fnPath)) throw new Error(`postback ${fn} 不存在`) // 確認檔案存在
  try {
    await require(fnPath)({ req, event, line, ga, args })
  } catch (err) {
    err.message = `postback ${fn}: ${err.message}`
    throw err
  }
}
