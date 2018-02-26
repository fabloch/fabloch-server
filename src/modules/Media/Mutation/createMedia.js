import checkAuthenticatedUser from "../../_shared/checkAuthenticatedUser"
import ValidationError from "../../_shared/ValidationError"

const createMedia = async ({ mediaInput }, { mongo: { Medias }, user }) => {
  checkAuthenticatedUser(user)
  if (!mediaInput.category) {
    throw new ValidationError([{ key: "category", message: "Missing category." }])
  }

  if (mediaInput.category === "IMAGE" && !mediaInput.picUrl) {
    throw new ValidationError([{ key: "picUrl", message: "Missing pic url." }])
  }

  if (mediaInput.category === "LINK" && !mediaInput.sourceUrl) {
    throw new ValidationError([{ key: "sourceUrl", message: "Missing source url." }])
  }

  const media = mediaInput

  const response = await Medias.insert(media)
  const [_id] = response.insertedIds
  media._id = _id
  return media
}

export default createMedia
