import { MongoClient } from "mongodb"
import {
  eventData,
  eventTicketData,
  membershipData,
  newcomerData,
  userData,
} from "./fixtures"

const random = () => Math.floor(Math.random() * 9999)
const MONGO_TEST_URL = `mongodb://localhost:27018/fabloch-server-test-${random()}`

export default async function () {
  const db = await MongoClient.connect(MONGO_TEST_URL)

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
