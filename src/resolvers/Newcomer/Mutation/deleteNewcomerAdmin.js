import { ObjectId } from "mongodb"
import { combineResolvers } from "graphql-resolvers"

import { isAdmin } from "../../_shared/auth"

const deleteNewcomer = combineResolvers(isAdmin, async (parent, args, { mongo: { Newcomers } }) => {
  const newcomerId = ObjectId(args.newcomerId)

  await Newcomers.remove({ _id: newcomerId })
  return true
})

export default deleteNewcomer
