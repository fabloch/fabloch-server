import { ObjectId } from "mongodb"

const isAdmin = async (user, { mongo: { Users } }) => {
  const usr = await Users.findOne({ _id: ObjectId(user._id) })
  if (usr.roles && usr.roles.indexOf("admin") > -1) {
    return true
  }
  return false
}

export default isAdmin
