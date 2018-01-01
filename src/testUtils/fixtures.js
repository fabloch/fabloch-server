import { ObjectId } from "mongodb"

export const admin = {
  _id: ObjectId("5a383f36d2834c317755ab17"),
  name: "Admin",
  email: "admin@example.com",
  password: "$2a$10$Htm2b52NAP2XE5pD8LnK2OP58PTf9kXxaEtKxMmbI28Udappwayy6",
  version: 1,
}
export const userData = [
  {
    _id: ObjectId("5a31b456c5e7b54a9aba3782"),
    name: "User One",
    email: "user1@example.com",
    password: "$2a$10$Htm2b52NAP2XE5pD8LnK2OP58PTf9kXxaEtKxMmbI28Udappwayy6",
    version: 1,
  },
  {
    _id: ObjectId("5a31b4efedc7474b9addc261"),
    name: "User Two",
    email: "user2@xample.com",
    password: "$2a$10$AyhLbNMCe6bIAKWOI/1PjOs6/wvQPnj6kQBRO4/PzjR8Jbb7bTHey",
    version: 1,
  },
]

export const membershipData = [
  {
    _id: ObjectId("5a383f36d2834c317755ab17"),
    plan: "PERSO",
    startDate: "2016-12-18T00:00:00.000Z",
    endDate: "2017-12-17T00:00:00.000Z",
    ownerId: ObjectId("5a31b456c5e7b54a9aba3782"),
  },
  {
    _id: ObjectId("5a383ffe50e6413193171110"),
    plan: "PERSO",
    startDate: "2017-12-18T00:00:00.000Z",
    endDate: "2018-12-17T00:00:00.000Z",
    ownerId: ObjectId("5a31b456c5e7b54a9aba3782"),
  },
  {
    _id: ObjectId("5a397f361e1dfa145c622785"),
    plan: "PERSO",
    startDate: "2017-12-18T00:00:00.000Z",
    endDate: "2018-12-17T00:00:00.000Z",
    ownerId: ObjectId("5a31b456c5e7b54a9aba3782"),
  },
]

export const eventData = [
  {
    _id: ObjectId("5a4a5eb6404da6d636078beb"),
    title: "Awesome event",
    ownerId: ObjectId("5a31b456c5e7b54a9aba3782"),
  },
  {
    _id: ObjectId("5a4a5ee36454c9d6369cca5f"),
    title: "Another awesome event",
    ownerId: ObjectId("5a31b456c5e7b54a9aba3782"),
  },
]
