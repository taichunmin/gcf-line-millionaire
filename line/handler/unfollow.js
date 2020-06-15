const _ = require('lodash')
const { db } = require('../../lib/firestore')

module.exports = async ({ req, event, line, ga }) => {
  const lineId = _.get(event, 'source.userId')
  await db.doc(`users/${lineId}`).delete()
  ga.screenView('封鎖')
}
