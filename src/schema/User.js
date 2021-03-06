import { gql } from "apollo-server-express"

export default gql`
  type User {
    id: ID!
    username: String
    email: String
    jwt: String
    fullName: String
    intro: String
    handicaps: String
    picUrl: String
    facebookUrl: String
    twitterUrl: String
    githubUrl: String
    linkedInUrl: String
    otherUrl: String
    memberships: [Membership!]
    isAdmin: Boolean!
    tickets: [EventTicket!]!
    trainArrival: DateTime
  }

  input AuthProviderNewcomerData {
    newcomer: AUTH_PROVIDER_NEWCOMER
  }

  input AUTH_PROVIDER_NEWCOMER {
    token: String!
    username: String!
    password: String!
  }

  input AUTH_PROVIDER_EMAIL {
    email: String!
    password: String!
  }

  extend type Query {
    # TODO: change for email
    user: User
    userList(byArrival: Boolean): [User!]!
  }

  extend type Mutation {
    createUser(authProvider: AuthProviderNewcomerData!): User
    signinUser(emailAuth: AUTH_PROVIDER_EMAIL): User
    updateUser(userInput: UserInput!): User
    updateProfile(profileInput: ProfileInput!): User
    # verifyUser(token: String!): User
    createUserAdmin(userInput: ExtendedUserInput!): User
    updateUserAdmin(userInput: ExtendedUserInput!): User
    deleteUserAdmin(userId: ID): Boolean
  }

  input UserInput {
    username: String
    email: Email
    password: String!
    newPassword: String
  }

  input ProfileInput {
    fullName: String
    intro: String
    handicaps: String
    picUrl: String
    facebookUrl: String
    twitterUrl: String
    githubUrl: String
    linkedInUrl: String
    otherUrl: String
    trainArrival: DateTime
  }

  input ExtendedUserInput {
    id: ID
    username: String
    email: Email
    password: String
    newPassword: String
    fullName: String
    intro: String
    handicaps: String
    picUrl: String
    facebookUrl: String
    twitterUrl: String
    githubUrl: String
    linkedInUrl: String
    otherUrl: String
    trainArrival: DateTime
  }
`
