import Vote from './Vote'

const User = `
  type User {
    id: ID!
    name: String!
    email: String
    jwt: String
    votes: [Vote!]!
  }

  input AuthProviderSignupData {
      email: AUTH_PROVIDER_EMAIL
  }

  input AUTH_PROVIDER_EMAIL {
      email: String!
      password: String!
  }
`

export default () => [User, Vote]
