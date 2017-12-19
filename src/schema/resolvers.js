import { mergeResolvers } from 'merge-graphql-schemas'
import userResolvers from '../modules/User/resolvers'
import membershipResolvers from '../modules/Membership/resolvers'
import scalarResolvers from '../modules/Scalars/resolvers'

const resolvers = [
  userResolvers,
  membershipResolvers,
  scalarResolvers,
]

export default mergeResolvers(resolvers)
