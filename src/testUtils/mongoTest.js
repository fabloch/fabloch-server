import { Logger, MongoClient } from "mongodb"
import { admin, userData, membershipData, eventData } from "./fixtures"

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
    Logger.filter("class", ["Cursor"])
  }

  const beforeEach = async () => {
    await db.createCollection("users")
    await db.createCollection("memberships")
    await db.createCollection("events")
  }

  const afterEach = async () => {
    await db.collection("users").drop()
    await db.collection("memberships").drop()
    await db.collection("events").drop()
  }

  const afterAll = () => {
    db.close()
  }

  const loadUsers = async () =>
    db.collection("users").insertMany(userData)

  const loadMemberships = async () =>
    db.collection("memberships").insertMany(membershipData)

  const loadEvents = async () =>
    db.collection("events").insertMany(eventData)

  return {
    beforeEach,
    afterEach,
    afterAll,
    loadUsers,
    loadMemberships,
    loadEvents,
    Users: db.collection("users"),
    Memberships: db.collection("memberships"),
    Events: db.collection("events"),
  }
}
