import { mergeResolvers } from "merge-graphql-schemas"
import userResolvers from "../modules/User/resolvers"
import membershipResolvers from "../modules/Membership/resolvers"
import eventResolvers from "../modules/Event/resolvers"
import scalarResolvers from "../modules/Scalars/resolvers"

const resolvers = [
  userResolvers,
  membershipResolvers,
  eventResolvers,
  scalarResolvers,
]

export default mergeResolvers(resolvers)
