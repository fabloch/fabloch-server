import { ObjectId } from "mongodb"

import checkAuthenticatedUser from "../../_shared/checkAuthenticatedUser"
import hasRole from "../../_shared/hasRole"
import ValidationError from "../../_shared/ValidationError"

const deleteNewcomer = async (
  data,
  { mongo: { Newcomers }, user },
) => {
  checkAuthenticatedUser(user)
  if (!hasRole(user, "admin")) {
    throw new ValidationError([{ key: "main", message: "Not allowed." }])
  }

  const newcomerId = ObjectId(data.newcomerId)

  await Newcomers.remove({ _id: newcomerId })
  return true
}

export default deleteNewcomer
