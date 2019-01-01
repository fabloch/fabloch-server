import { MongoClient } from "mongodb"
import {
  admin,
  eventCatData,
  eventModelData,
  eventSessionData,
  eventTicketData,
  mediaData,
  membershipData,
  newcomerData,
  placeData,
  userData,
} from "./fixtures"

const MONGO_TEST_URL = `mongodb://localhost:27018`

export default async function() {
  try {
    const client = await MongoClient.connect(
      MONGO_TEST_URL,
      { useNewUrlParser: true },
    )

    const db = client.db(`fabloch-server-test-${Date.now()}`)

    const beforeEach = async () => {
      await db.createCollection("eventCats")
      await db.createCollection("eventModels")
      await db.createCollection("eventSessions")
      await db.createCollection("eventTickets")
      await db.createCollection("medias")
      await db.createCollection("memberships")
      await db.createCollection("newcomers")
      await db.createCollection("places")
      await db.createCollection("users")
    }

    const afterEach = async () => {
      await db.collection("eventCats").drop()
      await db.collection("eventModels").drop()
      await db.collection("eventSessions").drop()
      await db.collection("eventTickets").drop()
      await db.collection("medias").drop()
      await db.collection("memberships").drop()
      await db.collection("newcomers").drop()
      await db.collection("places").drop()
      await db.collection("users").drop()
    }

    const afterAll = async () => {
      await client.close()
    }

    const loadAdmin = async () => db.collection("users").insertOne(admin)
    const loadEventCats = async () => db.collection("eventCats").insertMany(eventCatData)
    const loadEventModels = async () => db.collection("eventModels").insertMany(eventModelData)
    const loadEventSessions = async () =>
      db.collection("eventSessions").insertMany(eventSessionData)
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
      loadEventCats,
      loadEventModels,
      loadEventSessions,
      loadEventTickets,
      loadMedias,
      loadMemberships,
      loadNewcomers,
      loadPlaces,
      loadUsers,
      EventCats: db.collection("eventCats"),
      EventModels: db.collection("eventModels"),
      EventSessions: db.collection("eventSessions"),
      EventTickets: db.collection("eventTickets"),
      Medias: db.collection("medias"),
      Memberships: db.collection("memberships"),
      Newcomers: db.collection("newcomers"),
      Places: db.collection("places"),
      Users: db.collection("users"),
    }
  } catch (e) {
    console.log("e", e)
  }
}
