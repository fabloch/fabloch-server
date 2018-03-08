import { ObjectId } from "mongodb"
import checkAuthenticatedUser from "../../_shared/checkAuthenticatedUser"
import hasRole from "../../_shared/hasRole"
import ValidationError from "../../_shared/ValidationError"

const deletePlace = async (
  { placeId },
  { mongo: { Places }, user },
) => {
  checkAuthenticatedUser(user)

  if (!hasRole(user, "admin")) {
    throw new ValidationError([{ key: "main", message: "Not allowed." }])
  }

  const _id = ObjectId(placeId)
  await Places.remove({ _id })

  return true
}

export default deletePlace
