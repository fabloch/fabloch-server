import Vote from './Vote'
import Link from './Link'
import User from './User'

const Mutation = `
  type Mutation {
    createLink(url: String!, description: String!): Link
    createVote(linkId: ID!): Vote
    createUser(name: String!, authProvider: AuthProviderSignupData!): User
    signinUser(email: AUTH_PROVIDER_EMAIL): User!
    updateUser(name: String, email: String, password: String): User!
    verifyUser(token: String!): User
  }
`

export default () => [Mutation, Vote, Link, User]
