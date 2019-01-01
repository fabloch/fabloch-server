import { ObjectId } from "mongodb"
import { combineResolvers } from "graphql-resolvers"

import { isAdmin } from "../../_shared/auth"

const deletePlace = combineResolvers(
  isAdmin,
  async (parent, { placeId }, { mongo: { Places } }) => {
    const _id = ObjectId(placeId)
    await Places.remove({ _id })

    return true
  },
)

export default deletePlace
