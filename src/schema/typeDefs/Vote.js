import User from './User'
import Link from './Link'

const Vote = `
  type Vote {
    id: ID!
    user: User!
    link: Link!
  }
`

export default () => [Vote, User, Link]
