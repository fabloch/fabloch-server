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
  eventSession0Astart: moment("2018-07-13T17:30:00.000Z").toDate(),
  eventSession0Aend: moment("2018-07-13T19:00:00.000Z").toDate(),
  eventSession0Bstart: moment("2018-07-14T10:30:00.000Z").toDate(),
  eventSession0Bend: moment("2018-07-14T12:00:00.000Z").toDate(),
  eventSession1Astart: moment("2018-07-14T10:30:00.000Z").toDate(),
  eventSession1Aend: moment("2018-07-14T12:00:00.000Z").toDate(),
  eventSession1Bstart: moment("2018-07-15T10:30:00.000Z").toDate(),
  eventSession1Bend: moment("2018-07-15T12:00:00.000Z").toDate(),
  overlapping1start: moment("2018-07-13T15:30:00.000Z").toDate(),
  overlapping1end: moment("2018-07-13T17:16:00.000Z").toDate(),
  overlapping2start: moment("2018-07-13T19:14:00.000Z").toDate(),
  overlapping2end: moment("2018-07-13T20:30:00.000Z").toDate(),
  invitationSentAt1: moment().utc().subtract(2, "d").toDate(),
  invitationSentAt2: moment().utc().subtract(1, "d").toDate(),
}

export const admin = {
  _id: ObjectId("5a383f36d2834c317755ab17"),
  email: "admin@example.com",
  password: "$2a$10$Htm2b52NAP2XE5pD8LnK2OP58PTf9kXxaEtKxMmbI28Udappwayy6",
  roles: ["admin"],
  version: 1,
}

export const eventCatData = [
  {
    _id: ObjectId("5a9feeac60363661402c1ce4"),
    name: "3D Printing",
    description: "3D Printing is really cool to give life to 3D objects",
    color: "blue",
  },
  {
    _id: ObjectId("5a9feeb060363661402c1ce6"),
    name: "Lasercut",
    description: "Lasercutting wood, plexiglas, etc.",
    color: "green",
  },
  {
    _id: ObjectId("5a9feeb560363661402c1ce8"),
    name: "Ecology",
    description: "Ecology",
    color: "orange",
  },
  {
    _id: ObjectId("5a9feeb860363661402c1cea"),
    name: "Maritime",
    description: "Anything about the sea",
    color: "yellow",
  },
]

export const eventModelData = [
  {
    _id: ObjectId("5a4a5eb6404da6d636078beb"),
    title: "This is EventModel 0 title (shows in A, not B)",
    intro: "This is EventModel 0 intro",
    description: "This is EventModel 0 description.\nShould show in A not in B.",
    ownerId: ObjectId("5a31b456c5e7b54a9aba3782"),
    speakerId: ObjectId("5a31b456c5e7b54a9aba3782"),
    seats: 2,
    placeId: ObjectId("5a5e17f5b16e8350cd5c036d"),
    eventCats: [
      {
        id: ObjectId("5a9feeac60363661402c1ce4"),
        name: "3D Printing",
        color: "blue",
      },
    ],
  },
  {
    _id: ObjectId("5a4a5ee36454c9d6369cca5f"),
    title: "EventModel 1 (1A published, 1B no)",
    intro: "Intro 1 (1A published, 1B no)",
    description: "This event has two sessions: 1A and 1B\nA is published.",
    ownerId: ObjectId("5a31b456c5e7b54a9aba3782"),
    eventCats: [
      {
        id: ObjectId("5a9feeb060363661402c1ce6"),
        name: "Lasercut",
        color: "green",
      },
    ],
  },
]
export const eventSessionData = [
  {
    hint: "0 Session 0A for EventModel 0",
    _id: ObjectId("5a95c520c14e2a0ce4eea6f5"),
    eventModelId: ObjectId("5a4a5eb6404da6d636078beb"),
    ownerId: ObjectId("5a31b456c5e7b54a9aba3782"),
    start: dateUtils.eventSession0Astart,
    end: dateUtils.eventSession0Aend,
    published: true,
    eventCatsSuper: [
      {
        id: ObjectId("5a9feeb560363661402c1ce8"),
        name: "Ecology",
        color: "orange",
      },
    ],
  },
  {
    hint: "1 Session 0B for EventModel 0",
    _id: ObjectId("5a95c526c14e2a0ce4eea6f8"),
    eventModelId: ObjectId("5a4a5eb6404da6d636078beb"),
    ownerId: ObjectId("5a31b456c5e7b54a9aba3782"),
    titleSuper: "Session B title (override)",
    introSuper: "Session B intro (override)",
    descriptionSuper: "Session B description (override).\nIs also overriding place and seats",
    start: dateUtils.eventSession0Bstart,
    end: dateUtils.eventSession0Bend,
    placeSuperId: ObjectId("5a5e17feb16e8350cd5c0372"),
    speakerSuperId: ObjectId("5a31b4efedc7474b9addc261"),
    seatsSuper: 1,
    published: true,
  },
  {
    hint: "2 Session 1A for EventModel 1",
    _id: ObjectId("5a95c52bc14e2a0ce4eea6fd"),
    eventModelId: ObjectId("5a4a5ee36454c9d6369cca5f"),
    ownerId: ObjectId("5a31b456c5e7b54a9aba3782"),
    start: dateUtils.eventSession1Astart,
    end: dateUtils.eventSession1Aend,
    published: true,
    eventCatsSuper: [
      {
        id: ObjectId("5a9feeb560363661402c1ce8"),
        name: "Ecology",
        color: "orange",
      },
    ],
  },
  {
    hint: "3 Session 1B for EventModel 1",
    _id: ObjectId("5a95c53cc14e2a0ce4eea705"),
    eventModelId: ObjectId("5a4a5ee36454c9d6369cca5f"),
    ownerId: ObjectId("5a31b456c5e7b54a9aba3782"),
    start: dateUtils.eventSession1Bstart,
    end: dateUtils.eventSession1Bend,
    published: false,
  },
  {
    hint: "4 Overlapping with start of Session 0A for EventModel 1",
    _id: ObjectId("5aa5402c606a47401ad19746"),
    eventModelId: ObjectId("5a4a5eb6404da6d636078beb"),
    ownerId: ObjectId("5a31b456c5e7b54a9aba3782"),
    start: dateUtils.overlapping1start,
    end: dateUtils.overlapping1end,
    published: true,
    eventCatsSuper: [
      {
        id: ObjectId("5a9feeb560363661402c1ce8"),
        name: "Ecology",
        color: "orange",
      },
    ],
  },
  {
    hint: "5 Overlapping with end of Session 0A for EventModel 1",
    _id: ObjectId("5aa5402c606a47401ad19745"),
    eventModelId: ObjectId("5a4a5ee36454c9d6369cca5f"),
    ownerId: ObjectId("5a31b456c5e7b54a9aba3782"),
    start: dateUtils.overlapping2start,
    end: dateUtils.overlapping2end,
    published: true,
    eventCatsSuper: [
      {
        id: ObjectId("5a9feeac60363661402c1ce4"),
        name: "3D Printing",
        color: "blue",
      },
    ],
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
    hint: "Main image for event 0",
    _id: ObjectId("5a5e2489b16e8350cd5c0d21"),
    title: "Hero Découpe Laser (eventModel)",
    picUrl: "https://s3-eu-west-1.amazonaws.com/fabloch-dev/sample/hero-decoupe_laser.jpg",
    category: "IMAGE",
    parentId: ObjectId("5a4a5eb6404da6d636078beb"),
    parentCollection: "EventModels",
    rank: 0,
  },
  {
    hint: "image 1 for event 0",
    _id: ObjectId("5a9d83f4a7ada82940426897"),
    title: "Vidéo de présentation (eventModel)",
    picUrl: "https://s3-eu-west-1.amazonaws.com/fabloch-dev/sample/youtube1.jpg",
    sourceUrl: "https://youtu.be/sJPPCtlQQrQ",
    category: "YOUTUBE",
    parentId: ObjectId("5a4a5eb6404da6d636078beb"),
    parentCollection: "EventModels",
    rank: 1,
  },
  {
    hint: "image 2 for event 0",
    _id: ObjectId("5a9d83fea7ada82940426899"),
    title: "Hero Découpe Laser (eventModel)",
    picUrl: "https://s3-eu-west-1.amazonaws.com/fabloch-dev/sample/robot-servo-arduino.jpg",
    category: "IMAGE",
    parentId: ObjectId("5a4a5eb6404da6d636078beb"),
    parentCollection: "EventModels",
    rank: 2,
  },
  {
    hint: "image 3 for event 0",
    _id: ObjectId("5a9d8402a7ada8294042689b"),
    title: "Test1 (eventModel)",
    picUrl: "https://s3-eu-west-1.amazonaws.com/fabloch-dev/sample/test1.jpg",
    category: "IMAGE",
    parentId: ObjectId("5a4a5eb6404da6d636078beb"),
    parentCollection: "EventModels",
    rank: 3,
  },
  {
    hint: "main image for event Session 0B",
    _id: ObjectId("5a9d8407a7ada8294042689d"),
    title: "Test2 (eventSession)",
    picUrl: "https://s3-eu-west-1.amazonaws.com/fabloch-dev/sample/test2.jpg",
    category: "IMAGE",
    parentId: ObjectId("5a95c526c14e2a0ce4eea6f8"),
    parentCollection: "EventSessions",
    rank: 0,
  },
  {
    hint: "image 1 for event Session 0B",
    _id: ObjectId("5a9d840aa7ada8294042689f"),
    title: "Test3 (eventSession)",
    picUrl: "https://s3-eu-west-1.amazonaws.com/fabloch-dev/sample/test3.jpg",
    category: "IMAGE",
    parentId: ObjectId("5a95c526c14e2a0ce4eea6f8"),
    parentCollection: "EventSessions",
    rank: 1,
  },
  {
    hint: "main image for Place 0",
    _id: ObjectId("5aa14a2bcf9f840b7c9d3ad7"),
    title: "Hero Découpe Laser (eventModel)",
    picUrl: "https://s3-eu-west-1.amazonaws.com/fabloch-dev/sample/hero-decoupe_laser.jpg",
    category: "IMAGE",
    parentId: ObjectId("5a5e17f5b16e8350cd5c036d"),
    parentCollection: "Places",
    rank: 0,
  },
  {
    hint: "image 1 for Place 0",
    _id: ObjectId("5aa14a2bcf9f840b7c9d3ad8"),
    title: "Vidéo de présentation (place)",
    picUrl: "https://s3-eu-west-1.amazonaws.com/fabloch-dev/sample/youtube1.jpg",
    sourceUrl: "https://youtu.be/sJPPCtlQQrQ",
    category: "YOUTUBE",
    parentId: ObjectId("5a5e17f5b16e8350cd5c036d"),
    parentCollection: "Places",
    rank: 1,
  },
  {
    hint: "image 2 for Place 0",
    _id: ObjectId("5aa14a2bcf9f840b7c9d3ad9"),
    title: "Hero Découpe Laser (place)",
    picUrl: "https://s3-eu-west-1.amazonaws.com/fabloch-dev/sample/robot-servo-arduino.jpg",
    category: "IMAGE",
    parentId: ObjectId("5a5e17f5b16e8350cd5c036d"),
    parentCollection: "Places",
    rank: 2,
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
    hint: "Newcomer3",
    _id: ObjectId("5a4b76d5fdea180e9295743c"),
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIxQGV4YW1wbGUuY29tIiwiaWF0IjoxNTE1ODQ1MzQzfQ.pJvXypuRpjdnVZoITVZzg8b85ZM-yuJWEzd8O4OBekA",
    email: "user3@example.com",
    valid: true,
    digits: [5, 5, 5, 5, 5, 5],
  },
  {
    hint: "Newcomer4",
    _id: ObjectId("5a55db614b7ef9289ba1ad23"),
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIzQGV4YW1wbGUuY29tIiwiaWF0IjoxNTE1ODQ0OTI1fQ.mNeqSHD4dT1FTfieci5fZGxktUWoiKXt2F4zGCTsYQo",
    email: "user4@example.com",
    digits: [5, 5, 5, 5, 5, 5],
  },
  {
    hint: "Newcomer5",
    _id: ObjectId("5ab8f7bca42fb619e902a1c2"),
    email: "user5@example.com",
    fullName: "User Five",
    guest: true,
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXI1QGV4YW1wbGUuY29tIiwiaWF0IjoxNTIyMTQ4MDA3fQ.tO61ImDbURBg04MaWb4bR1LgJCgSY01dzZIDmVU2W4M",
    invitationSentAt: dateUtils.invitationSentAt1,
    invitationSentCount: 1,
  },
  {
    hint: "Newcomer6",
    _id: ObjectId("5ab8f7d5a42fb619e902a1c3"),
    email: "user6@example.com",
    fullName: "User Six",
    guest: true,
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXI2QGV4YW1wbGUuY29tIiwiaWF0IjoxNTIyMTQ4MDcxfQ.Fz54JRAhpz7C5HFwnQDITWh0qPGK7-p9dvihFHCN5nI",
    invitationSentAt: dateUtils.invitationSentAt2,
  },
]

export const placeData = [
  {
    _id: ObjectId("5a5e17f5b16e8350cd5c036d"),
    title: "La Fabrique du Loch",
    street1: "8 Rue Georges Clemenceau",
    zipCode: "56400",
    city: "Auray",
    country: "France",
    stateProvince: "Morbihan",
    published: true,
    lat: 47.6683664,
    lng: -2.9860108,
  },
  {
    _id: ObjectId("5a5e17feb16e8350cd5c0372"),
    title: "Le Petit Théâtre",
    street1: "103 Place de la République",
    zipCode: "56400",
    city: "Auray",
    country: "France",
    stateProvince: "Morbihan",
    published: true,
    lat: 47.666605,
    lng: -2.984241,
  },
  {
    _id: ObjectId("5a5e17feb16e8350cd5c0373"),
    title: "Salles du Penher",
    street1: "12 Rue du Penher",
    zipCode: "56400",
    city: "Auray",
    country: "France",
    stateProvince: "Morbihan",
    lat: 47.669791,
    lng: -2.986930,
  },
]

export const userData = [
  {
    _id: ObjectId("5a31b456c5e7b54a9aba3782"),
    username: "user1",
    email: "user1@example.com",
    password: "$2a$10$Htm2b52NAP2XE5pD8LnK2OP58PTf9kXxaEtKxMmbI28Udappwayy6",
    version: 1,
    profile: {
      fullName: "John Doe",
      picUrl: "https://s3-eu-west-1.amazonaws.com/fabloch-dev/sample/profile_banksy.jpg",
      intro: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      facebookUrl: "https://www.facebook.com/facebookUrl1",
      twitterUrl: "https://www.twitter.com/twitterUrl1",
      githubUrl: "https://www.github.com/githubUrl1",
      linkedInUrl: "https://www.linkedIn.com/linkedInUrl1",
      otherUrl: "https://www.other.com/otherUrl1",
    },
  },
  {
    _id: ObjectId("5a31b4efedc7474b9addc261"),
    username: "user2",
    email: "user2@example.com",
    password: "$2a$10$AyhLbNMCe6bIAKWOI/1PjOs6/wvQPnj6kQBRO4/PzjR8Jbb7bTHey",
    version: 1,
    profile: {
      fullName: "Monsieur Chat",
      picUrl: "https://s3-eu-west-1.amazonaws.com/fabloch-dev/sample/profile_m_chat.jpg",
      intro: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      facebookUrl: "https://www.facebook.com/facebookUrl2",
      twitterUrl: "https://www.twitter.com/twitterUrl2",
      linkedInUrl: "https://www.linkedIn.com/linkedInUrl2",
    },
  },
]

const idGenerator = [
  { a: true },
  { a: true },
  { a: true },
  { a: true },
  { a: true },
  { a: true },
  { a: true },
  { a: true },
  { a: true },
  { a: true },
]

const loadFixtures = async () => {
  const db = await MongoClient.connect("mongodb://localhost:27017/fabloch-server")

  db.dropDatabase()

  await db.collection("users").insert(admin)
  await db.collection("eventCats").insertMany(eventCatData)
  await db.collection("eventModels").insertMany(eventModelData)
  await db.collection("eventSessions").insertMany(eventSessionData)
  await db.collection("eventTickets").insertMany(eventTicketData)
  await db.collection("medias").insertMany(mediaData)
  await db.collection("memberships").insertMany(membershipData)
  await db.collection("newcomers").insertMany(newcomerData)
  await db.collection("places").insertMany(placeData)
  await db.collection("users").insertMany(userData)
  await db.collection("randomIds").insertMany(idGenerator)

  db.close()
}

if (process.env.NODE_ENV !== "test") {
  loadFixtures()
}
