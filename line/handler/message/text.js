const _ = require('lodash')

module.exports = async ({ req, event, line, ga }) => {
  await line.replyMessage(event.replyToken, {
    type: 'text',
    text: _.get(event, 'message.text'),
  })
}
