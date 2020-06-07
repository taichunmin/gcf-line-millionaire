const _ = require('lodash')

module.exports = async ({ req, event, line, ga }) => {
  // 送出使用者資料
  const profile = await line.getProfile(_.get(event, 'source.userId'))
  ga.screenView('加入好友')
  _.each(profile, (v, k) => ga.event('profile', k, { el: _.truncate(v, { length: 128 }) }))
  await line.replyMessage(event.replyToken, require('../view/welcome')({ event }))
}
