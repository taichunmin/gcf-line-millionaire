const _ = require('lodash')
const getCsv = require('./get-csv')

exports.getQuests = (() => {
  const CSV_QUESTS = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vStsbd6-D5k-qzIqJo-766nUsoOzsej91VoCRPbH40iYEG-s7S9t1xIY4HVTjneEClz3U9OIjFkBXml/pub?gid=0&single=true&output=csv'
  let quests = null
  return async () => {
    if (!quests) quests = await getCsv(CSV_QUESTS)
    return quests
  }
})()

exports.getQuestById = (() => {
  let result = null
  return async id => {
    if (!result) result = _.keyBy(await exports.getQuests(), 'id')
    return _.get(result, id)
  }
})()
