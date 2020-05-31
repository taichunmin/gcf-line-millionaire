const _ = require('lodash')
const Line = require('@line/bot-sdk').Client
const lineHandler = require('./line/handler')

exports.main = async (req, res) => {
  try {
    // 處理 access token
    const channelAccessToken = req.path.substring(1)
    if (!/^[a-zA-Z0-9+/=]+$/.test(channelAccessToken)) throw new Error('wrong channel access token')
    const line = new Line({ channelAccessToken })

    // 處理 events
    const events = _.get(req, 'body.events', [])
    await Promise.all(_.map(events, event => lineHandler({ req, event, line })))
    res.status(200).send('OK')
  } catch (err) {
    console.log('index err =', JSON.stringify(err))
    res.status(err.status || 500).send(err.message)
  }
}
