import { Logger, MongoClient } from 'mongodb'
import { MONGODB_URI } from '../utils/config'

export default async function () {
  const db = await MongoClient.connect(MONGODB_URI)

  let logCount = 0
  Logger.setCurrentLogger((msg) => {
    // eslint-disable-next-line no-console
    console.log(`MONGO DB REQUEST ${logCount += 1}: ${msg})`)
  })
  Logger.setLevel('debug')
  Logger.filter('class', ['Cursor'])

  return {
    Users: db.collection('users'),
    Memberships: db.collection('memberships'),
  }
}
