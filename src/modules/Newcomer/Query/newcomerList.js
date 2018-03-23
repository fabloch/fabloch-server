import checkAuthenticatedUser from "../../_shared/checkAuthenticatedUser"
import hasRole from "../../_shared/hasRole"
import ValidationError from "../../_shared/ValidationError"

const newcomerList = async ({ mongo: { Newcomers }, user }) => {
  checkAuthenticatedUser(user)
  if (!hasRole(user, "admin")) {
    throw new ValidationError([{
      key: "main",
      message: "Not allowed.",
    }])
  }
  return Newcomers.find({}).toArray()
}

export default newcomerList
