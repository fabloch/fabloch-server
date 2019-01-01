import { gql } from "apollo-server-express"

export default gql`
  type EventCat {
    id: ID!
    name: String!
    color: String
  }

  extend type Query {
    eventCatList: [EventCat!]!
  }

  extend type Mutation {
    createEventCat(eventCatInput: CreateEventCatInput!): EventCat!
    deleteEventCat(eventCatId: ID!): Boolean
    updateEventCat(eventCatInput: UpdateEventCatInput!): EventCat!
  }
  input CreateEventCatInput {
    name: String!
    color: String
  }
  input UpdateEventCatInput {
    id: ID!
    name: String!
    color: String
  }
`
