import { gql } from "apollo-server-express"

export default gql`
  type EventTicket {
    id: ID!
    eventSession: EventSession!
    owner: User!
  }

  extend type Mutation {
    createEventTicket(eventTicketInput: EventTicketInput!): EventTicket
    deleteEventTicket(eventTicketId: ID!): Boolean
  }

  input EventTicketInput {
    eventSessionId: ID!
  }
`
