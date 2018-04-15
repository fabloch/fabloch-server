import checkAuthenticatedUser from "../../_shared/checkAuthenticatedUser"
import hasRole from "../../_shared/hasRole"
import ValidationError from "../../_shared/ValidationError"
import deleteUserAndRelated from "./deleteUserAndRelated"

const deleteUserAdmin = async ({ userId }, context) => {
  const { user } = context
  checkAuthenticatedUser(user)

  if (!hasRole(user, "admin")) {
    throw new ValidationError([{ key: "main", message: "Not allowed." }])
  }

  await deleteUserAndRelated(userId, context)

  return true
}

export default deleteUserAdmin
