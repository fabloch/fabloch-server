import { ObjectId, MongoClient } from "mongodb"

// TODO: dynamic dates

export const admin = {
  _id: ObjectId("5a383f36d2834c317755ab17"),
  email: "admin@example.com",
  password: "$2a$10$Htm2b52NAP2XE5pD8LnK2OP58PTf9kXxaEtKxMmbI28Udappwayy6",
  isAdmin: true,
  version: 1,
}
export const eventData = [
  {
    _id: ObjectId("5a4a5eb6404da6d636078beb"),
    title: "Awesome event",
    ownerId: ObjectId("5a31b456c5e7b54a9aba3782"),
    seats: 2,
    start: "2019-12-18T17:30:00.000Z",
    end: "2019-12-18T19:00:00.000Z",
  },
  {
    _id: ObjectId("5a4a5ee36454c9d6369cca5f"),
    title: "Another awesome event",
    ownerId: ObjectId("5a31b456c5e7b54a9aba3782"),
    seats: 2,
    start: "2019-12-19T10:30:00.000Z",
    end: "2019-12-19T12:00:00.000Z",
  },
]
export const eventTicketData = [
  {
    _id: ObjectId("5a4d56eeb230a538a7efb8e1"),
    participantId: ObjectId("5a31b4efedc7474b9addc261"),
    eventId: ObjectId("5a4a5eb6404da6d636078beb"),
  },
  {
    _id: ObjectId("5a4d576f269ec838c4c40142"),
    participantId: ObjectId("5a383f36d2834c317755ab17"),
    eventId: ObjectId("5a4a5eb6404da6d636078beb"),
  },
]
export const membershipData = [
  {
    _id: ObjectId("5a383f36d2834c317755ab17"),
    plan: "PERSO",
    start: "2016-12-18T00:00:00.000Z",
    end: "2017-12-17T00:00:00.000Z",
    ownerId: ObjectId("5a31b456c5e7b54a9aba3782"),
  },
  {
    _id: ObjectId("5a383ffe50e6413193171110"),
    plan: "PERSO",
    start: "2017-12-18T00:00:00.000Z",
    end: "2018-12-17T00:00:00.000Z",
    ownerId: ObjectId("5a31b456c5e7b54a9aba3782"),
  },
  {
    _id: ObjectId("5a397f361e1dfa145c622785"),
    plan: "PERSO",
    start: "2017-12-18T00:00:00.000Z",
    end: "2018-12-17T00:00:00.000Z",
    ownerId: ObjectId("5a31b4efedc7474b9addc261"),
  },
]
export const newcomerData = [
  {
    _id: ObjectId("5a4b76d5fdea180e9295743c"),
    email: "user1@example.com",
    digits: [5, 5, 5, 5, 5, 5],
  },
]
export const userData = [
  {
    _id: ObjectId("5a31b456c5e7b54a9aba3782"),
    email: "user1@example.com",
    password: "$2a$10$Htm2b52NAP2XE5pD8LnK2OP58PTf9kXxaEtKxMmbI28Udappwayy6",
    version: 1,
  },
  {
    _id: ObjectId("5a31b4efedc7474b9addc261"),
    email: "user2@xample.com",
    password: "$2a$10$AyhLbNMCe6bIAKWOI/1PjOs6/wvQPnj6kQBRO4/PzjR8Jbb7bTHey",
    version: 1,
  },
]

const loadFixtures = async () => {
  const db = await MongoClient.connect("mongodb://localhost:27017/fabloch-server")

  db.dropDatabase()

  await db.collection("users").insert(admin)
  await db.collection("events").insertMany(eventData)
  await db.collection("eventTickets").insertMany(eventTicketData)
  await db.collection("memberships").insertMany(membershipData)
  await db.collection("newcomers").insertMany(newcomerData)
  await db.collection("users").insertMany(userData)

  db.close()
}

loadFixtures()
