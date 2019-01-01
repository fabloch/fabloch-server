import { combineResolvers } from "graphql-resolvers"
import { isAdmin } from "../../_shared/auth"
import deleteUserAndRelated from "./deleteUserAndRelated"

const deleteUserAdmin = combineResolvers(isAdmin, async (parent, { userId }, context) => {
  await deleteUserAndRelated(userId, context)

  return true
})

export default deleteUserAdmin
