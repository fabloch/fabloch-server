import hasRole from "./hasRole"

const isOwnerOrAdmin = (object, user) => {
  if (hasRole(user, "admin")) {
    return true
  }
  if (object.ownerId.toString() === user._id.toString()) {
    return true
  }
  return false
}

export default isOwnerOrAdmin
