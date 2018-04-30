import { ObjectId } from "mongodb"
import checkAuthenticatedUser from "../../_shared/checkAuthenticatedUser"

const deleteMedia = async (
  data,
  { mongo: { Medias }, user },
) => {
  checkAuthenticatedUser(user)
  const mediaId = ObjectId(data.mediaId)
  await Medias.remove({ _id: mediaId })

  return true
}

export default deleteMedia
