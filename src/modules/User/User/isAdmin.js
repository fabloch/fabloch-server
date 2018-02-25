import { ObjectId } from "mongodb"
import hasRole from "../../_shared/hasRole"

const isAdmin = async (user, { mongo: { Users } }) => {
  const usr = await Users.findOne({ _id: ObjectId(user._id) })
  return hasRole(usr, "admin")
}

export default isAdmin
