import checkAuthenticatedUser from "../../_shared/checkAuthenticatedUser"
import hasRole from "../../_shared/hasRole"
import ValidationError from "../../_shared/ValidationError"
import newcomerExists from "../_shared/newcomerExists"
import createNewcomerToken from "../_shared/createNewcomerToken"

const createNewcomer = async ({ newcomerInput }, { mongo: { Newcomers, Users }, user }) => {
  checkAuthenticatedUser(user)

  if (!hasRole(user, "admin")) {
    throw new ValidationError([{ key: "main", message: "Not allowed." }])
  }

  const newcomer = newcomerInput
  newcomer.guest = true
  const previousNewcomer = await newcomerExists(newcomer, Newcomers, Users)

  newcomer.token = await createNewcomerToken(newcomer.email)
  if (previousNewcomer) {
    throw new ValidationError([{ key: "main", message: "A newcomer or a user already exists." }])
  }
  const response = await Newcomers.insert(newcomer)
  const [_id] = response.insertedIds
  newcomer._id = _id
  return newcomer
}

export default createNewcomer
