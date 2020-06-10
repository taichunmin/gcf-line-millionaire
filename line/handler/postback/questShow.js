const _ = require('lodash')
const { db } = require('../../../lib/firestore')
const libQuest = require('../../../lib/quest')

module.exports = async ({ req, event, line, ga, args }) => {
  const userId = _.get(event, 'source.userId')
  const user = (await db.doc(`users/${userId}`).get()).data()

  const msg = []
  const questId = _.get(user, 'questCur', 19)
  await libQuest.showQuest({ questId, msg, ga })
  await event.replyMessage(msg)
}
