const _ = require('lodash')
const admin = require('firebase-admin')
const getenv = require('./getenv')

try {
  const serviceAccount = JSON.parse(getenv('FIREBASE_SA_KEY'))
  const adminConfig = JSON.parse(getenv('FIREBASE_CONFIG'))
  if (!_.hasIn(serviceAccount, 'client_email')) throw new Error()
  adminConfig.credential = admin.credential.cert(serviceAccount)
  admin.initializeApp(adminConfig)
} catch (err) {
  admin.initializeApp()
}

module.exports = {
  db: admin.firestore(),
  firestore: admin.firestore,
}
