const _ = require('lodash')

module.exports = (key, defaultval) => {
  return _.get(process, ['env', key], defaultval)
}
