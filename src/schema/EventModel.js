import { gql } from "apollo-server-express"

export default gql`
  type EventModel {
    id: ID!
    isSession: Boolean!
    title: String
    intro: String
    description: String
    mainMedia: Media
    medias: [Media!]!
    owner: User!
    speaker: User
    seats: Int
    place: Place
    sessions: [EventSession!]!
    eventCats: [EventCat!]!

    introAny: String
    titleAny: String
    descriptionAny: String
    speakerAny: User
    seatsAny: Int
    placeAny: Place
    eventCatsAny: [EventCat!]!
  }

  extend type Query {
    eventModelList(filter: EventModelFilter): [EventModel!]!
    eventModelDetail(id: String): EventModel
  }
  input EventModelFilter {
    OR: [EventModelFilter!]
    title_contains: String
    intro_contains: String
    description_contains: String
  }

  extend type Mutation {
    createEventModel(eventModelInput: CreateEventModelInput!): EventModel
    deleteEventModel(eventModelId: ID!): Boolean
    updateEventModel(eventModelInput: UpdateEventModelInput!): EventModel
  }
  input CreateEventModelInput {
    title: String
    intro: String
    description: String
    seats: Int
    placeId: ID
    speakerId: ID
    eventCatIds: [ID]
  }
  input UpdateEventModelInput {
    id: ID!
    title: String
    intro: String
    description: String
    seats: Int
    placeId: ID
    speakerId: ID
    eventCatIds: [ID]
  }

  extend type Subscription {
    EventModel(filter: EventModelSubscriptionFilter): EventModelSubscriptionPayload
  }
  input EventModelSubscriptionFilter {
    mutation_in: [_ModelMutationType!]
  }
  type EventModelSubscriptionPayload {
    mutation: _ModelMutationType!
    node: EventModel
  }
`
