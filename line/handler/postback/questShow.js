const _ = require('lodash')
const { db } = require('../../../lib/firestore')
const libQuest = require('../../../lib/quest')

module.exports = async ({ req, event, line, ga, args }) => {
  const userId = _.get(event, 'source.userId')
  const user = (await db.doc(`users/${userId}`).get()).data()

  const questCur = _.get(user, 'questCur', 1)
  const quest = await libQuest.getQuestById(questCur)
  if (!quest) throw new Error(`找不到題目 ${questCur}`)

  const msg = require('../../view/quest/show')(quest)
  await line.replyMessage(event.replyToken, msg)
}
