import { combineResolvers } from "graphql-resolvers"
import { isAdmin } from "../../_shared/auth"

const newcomerList = combineResolvers(isAdmin, async (parent, args, { mongo: { Newcomers } }) =>
  Newcomers.find({}).toArray(),
)

export default newcomerList
