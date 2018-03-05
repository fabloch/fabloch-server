import { ObjectId } from "mongodb"
import checkAuthenticatedUser from "../../_shared/checkAuthenticatedUser"
import checkMissing from "../../_shared/checkMissing"
import ValidationError from "../../_shared/ValidationError"

const createMedia = async ({ mediaInput }, { mongo: { Medias }, user }) => {
  checkAuthenticatedUser(user)
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

export default createMedia
