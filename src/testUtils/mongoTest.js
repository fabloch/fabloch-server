import { Logger, MongoClient } from "mongodb"
import {
  userData,
  membershipData,
  eventData,
  newcomerData,
} from "./fixtures"

const MONGO_URL = "mongodb://localhost:27017/fabloch-server-test"

export default async function () {
  const db = await MongoClient.connect(MONGO_URL)

  if (process.env.NODE_ENV === "development") {
    let logCount = 0
    Logger.setCurrentLogger((msg) => {
      // eslint-disable-next-line no-console
      console.log(`MONGO DB REQUEST ${logCount += 1}: ${msg})`)
    })
    Logger.setLevel("debug")
    Logger.filter("class",
    ["Cursor"])
  }

  const beforeEach = async () => {
    await db.createCollection("users")
    await db.createCollection("memberships")
    await db.createCollection("events")
    await db.createCollection("newcomers")
  }

  const afterEach = async () => {
    await db.collection("users").drop()
    await db.collection("memberships").drop()
    await db.collection("events").drop()
    await db.collection("newcomers").drop()
  }

  const afterAll = async () => {
    await db.close()
  }

  const loadEvents = async () => db.collection("events").insertMany(eventData)
  const loadMemberships = async () => db.collection("memberships").insertMany(membershipData)
  const loadNewcomers = async () => db.collection("newcomers").insertMany(newcomerData)
  const loadUsers = async () => db.collection("users").insertMany(userData)

  return {
    beforeEach,
    afterEach,
    afterAll,
    loadEvents,
    loadMemberships,
    loadNewcomers,
    loadUsers,
    Events: db.collection("events"),
    Memberships: db.collection("memberships"),
    Newcomers: db.collection("newcomers"),
    Users: db.collection("users"),
  }
}
