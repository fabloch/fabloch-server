import { Logger, MongoClient } from 'mongodb'

const MONGO_URL = 'mongodb://localhost:27017/fabloch-server'

export default async function () {
  const db = await MongoClient.connect(MONGO_URL)

  let logCount = 0
  Logger.setCurrentLogger((msg) => {
    // eslint-disable-next-line no-console
    console.log(`MONGO DB REQUEST ${logCount += 1}: ${msg})`)
  })
  Logger.setLevel('debug')
  Logger.filter('class', ['Cursor'])

  return {
    Links: db.collection('links'),
    Users: db.collection('users'),
    Votes: db.collection('votes'),
  }
}
