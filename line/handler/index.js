const _ = require('lodash')
const GoogleAnalytics = require('../../lib/google-analytics')

// 定義 Error.toJSON
if (!Error.prototype.toJSON) {
  Error.prototype.toJSON = function () { return require('../../lib/error-to-json')(this) } // eslint-disable-line
}

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

    const ga = new GoogleAnalytics(event.source.userId) // GA 初始化

    const eventType = _.get(event, 'type')
    if (_.hasIn(handlers, eventType)) await handlers[eventType]({ req, event, line, ga })

    await ga.flush() // 送出 GA 資料
  } catch (err) {
    console.log('line/handler err =', JSON.stringify(err))
    await line.replyMessage(event.replyToken, { type: 'text', text: err.message })
  }
}
