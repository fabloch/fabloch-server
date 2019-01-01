import { ObjectId } from "mongodb"
import { UserInputError } from "apollo-server"
import { combineResolvers } from "graphql-resolvers"
import { isEmpty } from "ramda"

import { isAdmin } from "../../_shared/auth"
import { checkMissing } from "../../_shared/input"

const createMedia = async (mediaInput, { mongo: { Medias } }) => {
  const media = mediaInput

  media.parentId = ObjectId(media.parentId)
  const response = await Medias.insertOne(media)
  media._id = response.insertedId
  return media
}

const updateMedia = async (mediaInput, { mongo: { Medias } }) => {
  const mediaFromDb = await Medias.findOne({ _id: ObjectId(mediaInput.id) })
  if (mediaFromDb) {
    const media = {
      ...mediaFromDb,
      ...mediaInput,
      _id: mediaFromDb._id,
      parentId: mediaFromDb.parentId,
    }
    delete media.id
    await Medias.update(mediaFromDb, media)
    return media
  }
  throw new UserInputError("No media with that ID.")
}

const saveMedia = combineResolvers(isAdmin, async (parent, { mediaInput }, context) => {
  let validationErrors = {}
  validationErrors = checkMissing(validationErrors, "category", mediaInput)
  validationErrors = checkMissing(validationErrors, "parentId", mediaInput)
  validationErrors = checkMissing(validationErrors, "parentCollection", mediaInput)
  validationErrors = checkMissing(validationErrors, "rank", mediaInput)

  if (mediaInput.category === "IMAGE" && !mediaInput.picUrl) {
    validationErrors = checkMissing(validationErrors, "picUrl", mediaInput)
  }

  if (mediaInput.category === "LINK" && !mediaInput.sourceUrl) {
    validationErrors = checkMissing(validationErrors, "sourceUrl", mediaInput)
  }

  if (!isEmpty(validationErrors)) {
    throw new UserInputError("Failed to update event session.", { validationErrors })
  }

  if (mediaInput.id) {
    return updateMedia(mediaInput, context)
  }
  return createMedia(mediaInput, context)
})

export default saveMedia
