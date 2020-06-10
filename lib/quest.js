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

exports.showQuest = async ({ questId, msg, ga }) => {
  const quest = await exports.getQuestById(questId)
  if (!quest) throw new Error(`找不到題目 ${questId}`)

  msg.push(require('../line/view/quest/show')(quest))
  ga.screenView('顯示題目')
  ga.event('顯示題目', '題號', { el: questId })
}
