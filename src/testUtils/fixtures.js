import { ObjectId, MongoClient } from "mongodb"
import moment from "moment"

export const dateUtils = {
  today: moment.utc().toDate(),
  inAYear: moment.utc().add(1, "y").subtract(1, "d").toDate(),
  user1membership1Start: moment.utc().subtract(2, "y").subtract(9, "d").toDate(),
  user1membership1End: moment.utc().subtract(1, "y").subtract(10, "d").toDate(),
  user1membership2Start: moment.utc().subtract(1, "y").subtract(9, "d").toDate(),
  user1membership2End: moment.utc().subtract(10, "d").toDate(),
  user2membership1Start: moment.utc().subtract(2, "y").add(10, "d").toDate(),
  user2membership1End: moment.utc().subtract(1, "y").add(9, "d").toDate(),
  user2membership2Start: moment.utc().subtract(1, "y").add(10, "d").toDate(),
  user2membership2End: moment.utc().add(9, "d").toDate(),
  eventSession0Astart: moment("2019-12-18T17:30:00.000Z").toDate(),
  eventSession0Aend: moment("2019-12-18T19:00:00.000Z").toDate(),
  eventSession0Bstart: moment("2019-12-19T10:30:00.000Z").toDate(),
  eventSession0Bend: moment("2019-12-19T12:00:00.000Z").toDate(),
  eventSession1Astart: moment("2019-12-20T10:30:00.000Z").toDate(),
  eventSession1Aend: moment("2019-12-20T12:00:00.000Z").toDate(),
  eventSession1Bstart: moment("2019-12-21T10:30:00.000Z").toDate(),
  eventSession1Bend: moment("2019-12-21T12:00:00.000Z").toDate(),
}

export const admin = {
  _id: ObjectId("5a383f36d2834c317755ab17"),
  email: "admin@example.com",
  password: "$2a$10$Htm2b52NAP2XE5pD8LnK2OP58PTf9kXxaEtKxMmbI28Udappwayy6",
  roles: ["admin"],
  version: 1,
}
export const eventModelData = [
  {
    _id: ObjectId("5a4a5eb6404da6d636078beb"),
    title: "This is EventModel 0 title (shows in A, not B)",
    description: "This is EventModel 0 description.\nShould show in A not in B.",
    ownerId: ObjectId("5a31b456c5e7b54a9aba3782"),
    seats: 2,
    placeId: ObjectId("5a5e17f5b16e8350cd5c036d"),
  },
  {
    _id: ObjectId("5a4a5ee36454c9d6369cca5f"),
    title: "EventModel 1 (1A published, 1B no)",
    description: "This event has two sessions: 1A and 1B\nA is published.",
    ownerId: ObjectId("5a31b456c5e7b54a9aba3782"),
    seats: 2,
    // placeId: ObjectId("5a5e17feb16e8350cd5c0372"),
  },
]
export const eventSessionData = [
  {
    hint: "Session 0A for EventModel 0",
    _id: ObjectId("5a95c520c14e2a0ce4eea6f5"),
    eventModelId: ObjectId("5a4a5eb6404da6d636078beb"),
    ownerId: ObjectId("5a31b456c5e7b54a9aba3782"),
    start: dateUtils.eventSession0Astart,
    end: dateUtils.eventSession0Aend,
    published: true,
  },
  {
    hint: "Session 0B for EventModel 0",
    _id: ObjectId("5a95c526c14e2a0ce4eea6f8"),
    eventModelId: ObjectId("5a4a5eb6404da6d636078beb"),
    ownerId: ObjectId("5a31b456c5e7b54a9aba3782"),
    title: "Session B title (override)",
    description: "Session B description (override).\nIs also overriding place and seats",
    start: dateUtils.eventSession0Bstart,
    end: dateUtils.eventSession0Bend,
    placeId: ObjectId("5a5e17feb16e8350cd5c0372"),
    seats: 1,
    published: true,
  },
  {
    hint: "Session 1A for EventModel 1",
    _id: ObjectId("5a95c52bc14e2a0ce4eea6fd"),
    eventModelId: ObjectId("5a4a5ee36454c9d6369cca5f"),
    ownerId: ObjectId("5a31b456c5e7b54a9aba3782"),
    start: dateUtils.eventSession1Astart,
    end: dateUtils.eventSession1Aend,
    published: true,
  },
  {
    hint: "Session 1B for EventModel 1",
    _id: ObjectId("5a95c53cc14e2a0ce4eea705"),
    eventModelId: ObjectId("5a4a5ee36454c9d6369cca5f"),
    ownerId: ObjectId("5a31b456c5e7b54a9aba3782"),
    start: dateUtils.eventSession1Bstart,
    end: dateUtils.eventSession1Bend,
    published: false,
  },
]
export const eventTicketData = [
  {
    hint: "eventTicket for eventSession0A and user1 (2 seats)",
    _id: ObjectId("5a4d56eeb230a538a7efb8e1"),
    ownerId: ObjectId("5a31b456c5e7b54a9aba3782"),
    eventSessionId: ObjectId("5a95c520c14e2a0ce4eea6f5"),
  },
  {
    hint: "eventTicket for eventSession0B and user2 (1 seat)",
    _id: ObjectId("5a4d576f269ec838c4c40142"),
    ownerId: ObjectId("5a31b4efedc7474b9addc261"),
    eventSessionId: ObjectId("5a95c526c14e2a0ce4eea6f8"),
  },
]

export const mediaData = [
  {
    _id: ObjectId("5a5e2489b16e8350cd5c0d21"),
    picUrl: "https://s3-eu-west-1.amazonaws.com/fabloch-dev/sample/hero-decoupe_laser.jpg",
    category: "IMAGE",
  },
  {
    _id: ObjectId("5a5e30f2b16e8350cd5c12b9"),
    picUrl: "https://s3-eu-west-1.amazonaws.com/fabloch-dev/sample/robot-servo-arduino.jpg",
    sourceUrl: "https://youtu.be/dJNH-E1HQd4",
    category: "YOUTUBE",
  },
  {
    _id: ObjectId("5a5e30f8b16e8350cd5c12bb"),
    title: "Link to Mediapart",
    sourceUrl: "http://www.mediapart.fr",
    category: "LINK",
  },
]

export const membershipData = [
  {
    _id: ObjectId("5a383f36d2834c317755ab17"),
    plan: "PERSO",
    start: dateUtils.user1membership1Start,
    end: dateUtils.user1membership1End,
    ownerId: ObjectId("5a31b456c5e7b54a9aba3782"),
  },
  {
    _id: ObjectId("5a383ffe50e6413193171110"),
    plan: "PERSO",
    start: dateUtils.user1membership2Start,
    end: dateUtils.user1membership2End,
    ownerId: ObjectId("5a31b456c5e7b54a9aba3782"),
  },
  {
    _id: ObjectId("5a397f361e1dfa145c622785"),
    plan: "PERSO",
    start: dateUtils.user2membership1Start,
    end: dateUtils.user2membership1End,
    ownerId: ObjectId("5a31b4efedc7474b9addc261"),
  },
  {
    _id: ObjectId("5a397f361e1dfa145c622666"),
    plan: "PERSO",
    start: dateUtils.user2membership2Start,
    end: dateUtils.user2membership2End,
    ownerId: ObjectId("5a31b4efedc7474b9addc261"),
  },
]

export const newcomerData = [
  {
    hint: "Newcomer1",
    _id: ObjectId("5a4b76d5fdea180e9295743c"),
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIxQGV4YW1wbGUuY29tIiwiaWF0IjoxNTE1ODQ1MzQzfQ.pJvXypuRpjdnVZoITVZzg8b85ZM-yuJWEzd8O4OBekA",
    email: "user1@example.com",
    digits: [5, 5, 5, 5, 5, 5],
    valid: true,
  },
  {
    hint: "Newcomer3",
    _id: ObjectId("5a55db614b7ef9289ba1ad23"),
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIzQGV4YW1wbGUuY29tIiwiaWF0IjoxNTE1ODQ0OTI1fQ.mNeqSHD4dT1FTfieci5fZGxktUWoiKXt2F4zGCTsYQo",
    email: "user3@example.com",
    digits: [5, 5, 5, 5, 5, 5],
  },
]

export const placeData = [
  {
    _id: ObjectId("5a5e17f5b16e8350cd5c036d"),
    title: "Place1 Salle polyvalente",
    street1: "16, rue du bout",
    zipCode: "56400",
    city: "Auray",
    country: "France",
    stateProvince: "Morbihan",
  },
  {
    _id: ObjectId("5a5e17feb16e8350cd5c0372"),
    title: "Place 2 Petit théâtre",
    street1: "2, rue de l'autre bout",
    zipCode: "56400",
    city: "Auray",
    country: "France",
    stateProvince: "Morbihan",
  },
]

export const userData = [
  {
    _id: ObjectId("5a31b456c5e7b54a9aba3782"),
    username: "user1",
    email: "user1@example.com",
    password: "$2a$10$Htm2b52NAP2XE5pD8LnK2OP58PTf9kXxaEtKxMmbI28Udappwayy6",
    version: 1,
  },
  {
    _id: ObjectId("5a31b4efedc7474b9addc261"),
    username: "user2",
    email: "user2@example.com",
    password: "$2a$10$AyhLbNMCe6bIAKWOI/1PjOs6/wvQPnj6kQBRO4/PzjR8Jbb7bTHey",
    version: 1,
  },
]

const loadFixtures = async () => {
  const db = await MongoClient.connect("mongodb://localhost:27017/fabloch-server")

  db.dropDatabase()

  await db.collection("users").insert(admin)
  await db.collection("eventModels").insertMany(eventModelData)
  await db.collection("eventSessions").insertMany(eventSessionData)
  await db.collection("eventTickets").insertMany(eventTicketData)
  await db.collection("memberships").insertMany(membershipData)
  await db.collection("newcomers").insertMany(newcomerData)
  await db.collection("users").insertMany(userData)

  db.close()
}

if (process.env.NODE_ENV !== "test") {
  loadFixtures()
}
