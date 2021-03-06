import { gql } from "apollo-server-express"

export default gql`
  type EventSession {
    id: ID!
    isSession: Boolean!
    model: EventModel
    title: String
    intro: String
    description: String
    mainMedia: Media
    medias: [Media!]!
    owner: User!
    start: DateTime
    end: DateTime
    tickets: [EventTicket!]!
    ticketCount: Int
    userStatus: UserStatus!
    seats: Int
    published: Boolean
    place: Place
    speaker: User
    eventCats: [EventCat!]!

    titlePrnt: String
    introPrnt: String
    descriptionPrnt: String
    seatsPrnt: Int
    mediasPrnt: [Media!]!
    placePrnt: Place
    speakerPrnt: User
    eventCatsPrnt: [EventCat!]

    introAny: String
    titleAny: String
    descriptionAny: String
    seatsAny: Int
    mediasAny: [Media!]!
    speakerAny: User
    placeAny: Place
    eventCatsAny: [EventCat!]!
  }

  type UserStatus {
    canTicket: Boolean!
    info: String!
    overlapping: EventSession
  }

  extend type Query {
    eventCatSessionList(eventCatId: ID!): [EventSession!]!
    eventModelSessionList(eventModelId: ID!): [EventSession!]!
    eventSessionList(filter: EventSessionFilter): [EventSession!]!
    eventSessionDetail(id: ID!): EventSession!
  }

  input EventSessionFilter {
    OR: [EventSessionFilter!]
    title_contains: String
    intro_contains: String
    description_contains: String
  }

  extend type Mutation {
    createEventSession(eventSessionInput: CreateEventSessionInput!): EventSession
    deleteEventSession(eventSessionId: ID!): Boolean
    updateEventSession(eventSessionInput: UpdateEventSessionInput!): EventSession
  }

  input CreateEventSessionInput {
    eventModelId: ID!
    title: String
    intro: String
    description: String
    seats: Int
    start: DateTime
    end: DateTime
    placeId: ID
    speakerId: ID
    eventCatIds: [ID!]
  }

  input UpdateEventSessionInput {
    id: ID!
    title: String
    intro: String
    description: String
    seats: Int
    start: DateTime
    end: DateTime
    placeId: ID
    speakerId: ID
    eventCatIds: [ID!]
  }

  extend type Subscription {
    EventSession(filter: EventSessionSubscriptionFilter): EventSessionSubscriptionPayload
  }

  input EventSessionSubscriptionFilter {
    mutation_in: [_ModelMutationType!]
  }

  type EventSessionSubscriptionPayload {
    mutation: _ModelMutationType!
    node: EventSession
  }
`
