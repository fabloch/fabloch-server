import { combineResolvers } from "graphql-resolvers"
import { isAdmin } from "../../_shared/auth"

const mediaList = combineResolvers(isAdmin, async (parent, args, { mongo: { Medias } }) =>
  Medias.find({}).toArray(),
)

export default mediaList
