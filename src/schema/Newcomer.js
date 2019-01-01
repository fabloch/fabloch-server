import { gql } from "apollo-server-express"

export default gql`
  type Newcomer {
    id: ID
    email: Email
    fullName: String
    token: String!
    guest: Boolean!
    valid: Boolean!
    invitationSentAt: DateTime
    invitationSentCount: Int
  }

  extend type Query {
    newcomerList: [Newcomer!]!
    newcomerFromToken(token: String): Newcomer
  }

  extend type Mutation {
    createNewcomer(newcomerInput: NewcomerInput): Newcomer
    createNewcomerAdmin(newcomerInput: NewcomerAdminInput): Newcomer
    updateNewcomerAdmin(newcomerInput: NewcomerAdminInput): Newcomer
    deleteNewcomerAdmin(newcomerId: ID!): Boolean
    checkDigits(newcomer: CheckDigitsInput): Newcomer
    sendInvitations(invitationInput: InvitationInput!): [Newcomer!]!
  }

  input NewcomerInput {
    email: String!
  }

  input NewcomerAdminInput {
    id: ID
    email: Email!
    fullName: String!
  }

  input CheckDigitsInput {
    token: String!
    digits: [Int!]!
  }

  input InvitationInput {
    newcomerIds: [ID!]!
    message: String
  }
`
