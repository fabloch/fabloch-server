import hasRole from "../../_shared/hasRole"
import ValidationError from "../../_shared/ValidationError"
import checkAuthenticatedUser from "../../_shared/checkAuthenticatedUser"

const mediaList = async (data, { mongo: { Medias }, user }) => {
  checkAuthenticatedUser(user)
  if (!hasRole(user, "admin")) {
    throw new ValidationError([{ key: "main", message: "Not allowed." }])
  }

  return Medias.find({}).toArray()
}

export default mediaList
