import { Logger, MongoClient } from "mongodb"
import {
  eventData,
  eventTicketData,
  membershipData,
  newcomerData,
  userData,
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
    Logger.filter("class", ["Cursor"])
  }

  const beforeEach = async () => {
    await db.createCollection("events")
    await db.createCollection("eventTickets")
    await db.createCollection("memberships")
    await db.createCollection("newcomers")
    await db.createCollection("users")
  }

  const afterEach = async () => {
    await db.collection("events").drop()
    await db.collection("eventTickets").drop()
    await db.collection("memberships").drop()
    await db.collection("newcomers").drop()
    await db.collection("users").drop()
  }

  const afterAll = async () => {
    await db.close()
  }

  const loadEvents = async () => db.collection("events").insertMany(eventData)
  const loadEventTickets = async () => db.collection("eventTickets").insertMany(eventTicketData)
  const loadMemberships = async () => db.collection("memberships").insertMany(membershipData)
  const loadNewcomers = async () => db.collection("newcomers").insertMany(newcomerData)
  const loadUsers = async () => db.collection("users").insertMany(userData)

  return {
    beforeEach,
    afterEach,
    afterAll,
    loadEvents,
    loadEventTickets,
    loadMemberships,
    loadNewcomers,
    loadUsers,
    Events: db.collection("events"),
    EventTickets: db.collection("eventTickets"),
    Memberships: db.collection("memberships"),
    Newcomers: db.collection("newcomers"),
    Users: db.collection("users"),
  }
}
