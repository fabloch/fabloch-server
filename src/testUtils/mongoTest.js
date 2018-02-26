import { MongoClient } from "mongodb"
import {
  admin,
  eventData,
  eventTicketData,
  mediaData,
  membershipData,
  newcomerData,
  placeData,
  userData,
} from "./fixtures"

const random = () => Math.floor(Math.random() * 9999)
const MONGO_TEST_URL = `mongodb://localhost:27018/fabloch-server-test-${random()}`

export default async function () {
  const db = await MongoClient.connect(MONGO_TEST_URL)

  const beforeEach = async () => {
    await db.createCollection("events")
    await db.createCollection("eventTickets")
    await db.createCollection("medias")
    await db.createCollection("memberships")
    await db.createCollection("newcomers")
    await db.createCollection("places")
    await db.createCollection("users")
  }

  const afterEach = async () => {
    await db.collection("events").drop()
    await db.collection("eventTickets").drop()
    await db.collection("medias").drop()
    await db.collection("memberships").drop()
    await db.collection("newcomers").drop()
    await db.collection("places").drop()
    await db.collection("users").drop()
  }

  const afterAll = async () => {
    await db.close()
  }

  const loadAdmin = async () => db.collection("users").insert(admin)
  const loadEvents = async () => db.collection("events").insertMany(eventData)
  const loadEventTickets = async () => db.collection("eventTickets").insertMany(eventTicketData)
  const loadMedias = async () => db.collection("medias").insertMany(mediaData)
  const loadMemberships = async () => db.collection("memberships").insertMany(membershipData)
  const loadNewcomers = async () => db.collection("newcomers").insertMany(newcomerData)
  const loadPlaces = async () => db.collection("places").insertMany(placeData)
  const loadUsers = async () => db.collection("users").insertMany(userData)

  return {
    beforeEach,
    afterEach,
    afterAll,
    loadAdmin,
    loadEvents,
    loadEventTickets,
    loadMedias,
    loadMemberships,
    loadNewcomers,
    loadPlaces,
    loadUsers,
    Events: db.collection("events"),
    EventTickets: db.collection("eventTickets"),
    Medias: db.collection("medias"),
    Memberships: db.collection("memberships"),
    Newcomers: db.collection("newcomers"),
    Places: db.collection("places"),
    Users: db.collection("users"),
  }
}
