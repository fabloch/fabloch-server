import { ObjectId } from "mongodb"
import { combineResolvers } from "graphql-resolvers"
import { isAdmin } from "../../_shared/auth"

const deleteMedia = combineResolvers(isAdmin, async (parent, args, { mongo: { Medias } }) => {
  const mediaId = ObjectId(args.mediaId)
  await Medias.removeOne({ _id: mediaId })

  return true
})

export default deleteMedia
