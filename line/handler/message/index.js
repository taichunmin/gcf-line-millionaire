const _ = require('lodash')

const handlers = {
  text: require('./text'),
}

module.exports = async ({ req, event, line, ga }) => {
  const msgType = _.get(event, 'message.type')
  if (_.hasIn(handlers, msgType)) await handlers[msgType]({ req, event, line, ga })
}
