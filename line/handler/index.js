const _ = require('lodash')

const handlers = {
  follow: require('./follow'),
  message: require('./message'),
  postback: require('./postback'),
  unfollow: require('./unfollow'),
}

module.exports = async ({ req, event, line }) => {
  try {
    // 先把 event 記錄到 google cloud logging
    console.log('event =', JSON.stringify(event))

    // 如果是測試訊息就直接不處理
    if (_.get(event, 'source.userId') === 'Udeadbeefdeadbeefdeadbeefdeadbeef') return

    // TODO: GA 初始化
    const ga = null

    const eventType = _.get(event, 'type')
    if (_.hasIn(handlers, eventType)) await handlers[eventType]({ req, event, line, ga })

    // TODO: 未處理

    // TODO: GA 送出資料
  } catch (err) {
    console.log('line/handler err =', JSON.stringify(err))
    await line.replyErrorMessage(event, err)
  }
}
