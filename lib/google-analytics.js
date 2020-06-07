const _ = require('lodash')
const axios = require('axios')
const errorToJson = require('../lib/error-to-json')
const getenv = require('../lib/getenv')
const Qs = require('qs')

const BATCH_LIMIT = 20
const GA_DEBUG = getenv('GA_DEBUG', 0)

const sleep = t => new Promise(resolve => { setTimeout(resolve, t) })

const PAYLOAD_DEFAULT = {
  aip: 1, // 忽略追蹤發送者 IP
  an: 'gcf-line-millionaire', // App Name
  av: require('../package.json').version,
  de: 'UTF-8', // chatset
  ds: 'app', // data source: web, app, or custom
  tid: getenv('GA_MEASUREMENT_ID', 'UA-39556213-10'),
  ul: 'zh-tw', // locale
  v: 1, // api version
}

class GoogleAnalytics {
  /**
   * 建立一個 Google Analytics 用來送出使用者行為資料，最後必須呼叫 flush()
   * @param {string} lineId - LINE 的 userId
   * @param {object} defaults - 預設的 payload 資料
   */
  constructor (lineId, defaults = {}) {
    if (GoogleAnalytics.isLineId(lineId)) {
      defaults.cid = GoogleAnalytics.lineIdToCid(lineId)
      defaults.uid = lineId
    }
    this.payloads = []
    this.defaults = defaults
  }

  /**
   * 判斷是不是合法的 LINE userId
   * @param {string} lineId - LINE 的 userId
   */
  static isLineId (lineId) {
    return lineId !== 'Udeadbeefdeadbeefdeadbeefdeadbeef' && /^U[0-9a-f]{32}$/.test(lineId)
  }

  /**
   * 把 LINE 的 userId 轉成 Google Analytics 的 client id
   * @param {string} lineId - LINE 的 userId
   */
  static lineIdToCid (lineId) {
    return lineId.replace(/^U(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})$/, '$1-$2-$3-$4-$5')
  }

  /**
   * 把 object 轉換成 query string
   * @param {object} obj - 要轉換的 object
   */
  static httpBuildQuery (obj) {
    return Qs.stringify(obj, { arrayFormat: 'brackets' })
  }

  /**
   * 把一個 Google Analytics 的 Hit Payload 轉成 query string
   * @param {object} payload - 一個 Google Analytics 的 Hit Payload
   */
  static payloadStringify (payload) {
    payload = { ...PAYLOAD_DEFAULT, ...payload }
    if (!payload.qt && payload.z) payload.qt = new Date() - payload.z
    return GoogleAnalytics.httpBuildQuery(payload)
  }

  /**
   * 每次有資料要送給 GA 的時候就要呼叫這個函式
   * @param {object} payload - 一個 Google Analytics 的 Hit Payload
   */
  hit (payload) {
    if (!payload.cid) throw _.set(new Error('cid 是必填參數'), 'data', payload)
    payload.z = +new Date()
    if (GA_DEBUG) console.log('hit =', JSON.stringify(payload))
    this.payloads.push(payload)
    return this
  }

  /**
   * 送出 GA 的 screen view
   * @param {string} name - 畫面名稱
   * @param {object} overrides - 用來覆蓋預設的 payload
   */
  screenView (name, overrides = {}) {
    if (!name) throw _.set(new Error('name 是必填參數'), 'data', arguments)
    this.hit({
      ...this.defaults,
      ...overrides,
      cd: name,
      t: 'screenview',
    })
    return this
  }

  /**
   * 送出 GA 的 Event
   * @param {string} category - 事件類別
   * @param {string} action - 事件動作
   * @param {object} overrides - 用來覆蓋預設的 payload
   */
  event (category, action, overrides = {}) {
    // Label (el) 和 Value (ev) 必須設定其中一個
    if (!overrides.el && !overrides.ev) throw _.set(new Error('Label (el) 和 Value (ev) 必須設定其中一個'), 'data', arguments)
    this.hit({
      ...this.defaults,
      ...overrides,
      t: 'event',
      ec: category,
      ea: action,
    })
    return this
  }

  /**
   * 送出目前 this.payloads 中所有的資料
   */
  async flush () {
    const chunks = _.chunk(this.payloads, BATCH_LIMIT)
    this.payloads = []
    await Promise.all(_.map(chunks, async chunk => {
      for (let i = 0; i < 3; i++) { // 重試 3 次
        try {
          if (i) await sleep(500) // 發生錯誤就等待 500ms
          const body = _.join(_.map(chunk, GoogleAnalytics.payloadStringify), '\r\n')
          if (GA_DEBUG) console.log('body =', body)
          await axios.post('https://www.google-analytics.com/batch', body)
          break
        } catch (err) {
          err.data = chunk
          console.log('flush error =', errorToJson(err))
        }
      }
    }))
  }
}

module.exports = GoogleAnalytics
