import checkAuthenticatedUser from "../../_shared/checkAuthenticatedUser"
import hasRole from "../../_shared/hasRole"
import ValidationError from "../../_shared/ValidationError"

const userList = async ({ mongo: { Users }, user }) => {
  checkAuthenticatedUser(user)
  if (!hasRole(user, "admin")) {
    throw new ValidationError([{
      key: "main",
      message: "Not allowed.",
    }])
  }
  return Users.find({}).toArray()
}

export default userList
