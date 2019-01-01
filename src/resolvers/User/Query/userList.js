import { combineResolvers } from "graphql-resolvers"
import { isAdmin } from "../../_shared/auth"

const userList = combineResolvers(isAdmin, async (parent, args, { mongo: { Users } }) => {
  return Users.find({}).toArray()
})

export default userList
