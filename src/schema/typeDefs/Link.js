import User from './User'
import Vote from './Vote'

const Link = `
  type Link {
    id: ID!
    url: String!
    description: String!
    postedBy: User
    votes: [Vote!]!
  }

  input LinkFilter {
    OR: [LinkFilter!]
    description_contains: String
    url_contains: String
  }  
`

export default () => [Link, User, Vote]
