import { Logger, MongoClient } from 'mongodb'
import { admin, userData } from './fixtures'

const MONGO_URL = 'mongodb://localhost:27017/fabloch-server-test'

export default async function () {
  const db = await MongoClient.connect(MONGO_URL)

  if (process.env.NODE_ENV === 'development') {
    let logCount = 0
    Logger.setCurrentLogger((msg) => {
      // eslint-disable-next-line no-console
      console.log(`MONGO DB REQUEST ${logCount += 1}: ${msg})`)
    })
    Logger.setLevel('debug')
    Logger.filter('class', ['Cursor'])
  }

  const beforeEach = async () => {
    await db.collection('users').insert(admin)
  }

  const afterEach = async () => {
    await db.collection('users').drop()
  }

  const afterAll = () => {
    db.close()
  }

  const loadUsers = async () =>
    db.collection('users').insertMany(userData)

  return {
    beforeEach,
    afterEach,
    afterAll,
    loadUsers,
    Users: db.collection('users'),
    Memberships: db.collection('memberships'),
  }
}
