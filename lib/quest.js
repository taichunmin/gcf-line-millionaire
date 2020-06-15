const _ = require('lodash')
const { db } = require('../lib/firestore')
const getCsv = require('./get-csv')
const Joi = require('@hapi/joi')

exports.questValidate = (() => {
  const schema = Joi.object({
    id: Joi.number().integer().min(1).max(20).required(),
    quest: Joi.string().empty('').required(),
    correct: Joi.number().integer().min(1).max(4).required(),
    option1: Joi.string().empty('').required(),
    option2: Joi.string().empty('').required(),
    option3: Joi.string().empty('').required(),
    option4: Joi.string().empty('').required(),
  })
  return value => schema.validateAsync(value, { stripUnknown: true })
})()

exports.getQuests = (() => {
  const CSV_QUESTS = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vStsbd6-D5k-qzIqJo-766nUsoOzsej91VoCRPbH40iYEG-s7S9t1xIY4HVTjneEClz3U9OIjFkBXml/pub?gid=0&single=true&output=csv'
  let quests = null
  return async () => {
    if (!quests) {
      quests = []
      const tmp = await getCsv(CSV_QUESTS)
      for (const quest of tmp) {
        try {
          quests.push(await exports.questValidate(quest))
        } catch (err) {
          console.log('questValidate err =', JSON.stringify(quest))
        }
      }
    }
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

exports.getQuestsLength = (() => {
  let length = null
  return async () => {
    if (length === null) length = (await exports.getQuests()).length
    return length
  }
})()

exports.showQuest = async ({ questId, msg, ga }) => {
  if (questId > await exports.getQuestsLength()) { // 答題結束
    msg.push(require('../line/view/quest/finish')())
    ga.screenView('答題結束')
    return
  }
  const quest = await exports.getQuestById(questId)
  if (!quest) throw new Error(`找不到題目 ${questId}`)

  msg.push(require('../line/view/quest/show')(quest))
  ga.screenView('顯示題目')
  ga.event('顯示題目', '題號', { el: questId })
}

exports.answerQuest = async ({ event, ga, args, msg }) => {
  const userId = _.get(event, 'source.userId')
  const userRef = db.doc(`users/${userId}`)

  return await db.runTransaction(async t => {
    const user = (await t.get(userRef)).data()
    if (!user) await t.set(userRef, {})
    const questCur = _.get(user, 'questCur', 1)
    if (questCur > await exports.getQuestsLength()) throw new Error('很抱歉，您已經回答完所有題目。')
    if (args[0] !== questCur) throw new Error(`很抱歉，您選擇的不是第 ${questCur} 題的選項。`)
    if (!_.isInteger(args[1]) || !_.inRange(args[1], 1, 5)) throw new Error(`參數錯誤 ${JSON.stringify(args)}`)

    const questNext = questCur + 1
    await t.update(userRef, {
      questCur: questNext,
      [`answer.${questCur}`]: args[1],
    })
    ga.screenView('回答題目')
    ga.event('回答題目', '題目-選項', { el: `${args[0]}-${args[1]}` })

    if (questNext > await exports.getQuestsLength()) { // 答題結束
      msg.push({ type: 'text', text: `您在第 ${args[0]} 題選擇了第 ${args[1]} 個選項。` })
      return questNext
    }
    msg.push({ type: 'text', text: `您在第 ${args[0]} 題選擇了第 ${args[1]} 個選項，請繼續回答第 ${questNext} 題。` })
    return questNext
  })
}
