const _ = require('lodash')

module.exports = async ({ req, event, line, ga }) => {
  const text = _.get(event, 'message.text')
  ga.screenView('未知訊息: 文字')
  ga.event('未知訊息', '文字', { el: _.truncate(text, { length: 64 }) })
  await line.replyMessage(event.replyToken, { type: 'text', text })
}
