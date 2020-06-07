const _ = require('lodash')

const ERROR_KEYS = [
  'address',
  'code',
  'data',
  'dest',
  'errno',
  'info',
  'message',
  'name',
  'originalError.response.data',
  'path',
  'port',
  'reason',
  'response.data',
  'response.headers',
  'response.status',
  'stack',
  'status',
  'statusCode',
  'statusMessage',
  'syscall',
]

module.exports = err => _.transform(ERROR_KEYS, (json, k) => {
  if (_.hasIn(err, k)) _.set(json, k, _.get(err, k))
}, {})
