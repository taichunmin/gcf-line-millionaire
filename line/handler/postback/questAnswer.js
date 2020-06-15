const _ = require('lodash')
const libQuest = require('../../../lib/quest')

module.exports = async ({ req, event, line, ga, args }) => {
  const msg = []

  try {
    const questId = await libQuest.answerQuest({ event, ga, args, msg })
    await libQuest.showQuest({ questId, msg, ga })
  } catch (err) {
    msg.push({ type: 'text', text: err.message })
  }
  await event.replyMessage(msg)
}
