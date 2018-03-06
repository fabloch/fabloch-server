import { ObjectId } from "mongodb"
import checkAuthenticatedUser from "../../_shared/checkAuthenticatedUser"
import checkMissing from "../../_shared/checkMissing"
import ValidationError from "../../_shared/ValidationError"

const updateMedia = async (mediaInput, { mongo: { Medias } }) => {
  const mediaFromDb = await Medias.findOne({ _id: ObjectId(mediaInput.id) })
  if (mediaFromDb) {
    await Medias.update(mediaFromDb, { $set: { ...mediaInput } })
    return { ...mediaFromDb, ...mediaInput }
  }
  throw new ValidationError([{ key: "main", message: "No media with that ID." }])
}

const saveMedia = async ({ mediaInput }, context) => {
  const { mongo: { Medias }, user } = context
  checkAuthenticatedUser(user)
  if (mediaInput.id) {
    return updateMedia(mediaInput, context)
  }
  let errors = []
  errors = checkMissing(
    ["category", "parentId", "parentCollection", "rank"],
    mediaInput,
    errors,
  )
  if (errors.length) throw new ValidationError(errors)

  if (mediaInput.category === "IMAGE" && !mediaInput.picUrl) {
    throw new ValidationError([{ key: "picUrl", message: "Missing pic url." }])
  }

  if (mediaInput.category === "LINK" && !mediaInput.sourceUrl) {
    throw new ValidationError([{ key: "sourceUrl", message: "Missing source url." }])
  }

  const media = mediaInput

  media.parentId = ObjectId(media.parentId)
  const response = await Medias.insert(media)
  const [_id] = response.insertedIds
  media._id = _id
  return media
}

export default saveMedia
