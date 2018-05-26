import { ObjectId } from "mongodb"
import checkAuthenticatedUser from "../../_shared/checkAuthenticatedUser"
import hasRole from "../../_shared/hasRole"
import ValidationError from "../../_shared/ValidationError"
import invalidEmail from "../../_shared/invalidEmail"
import newcomerExists from "../_shared/newcomerExists"

const updateNewcomerAdmin = async (data, { mongo: { Newcomers, Users }, user }) => {
  // checking context user is admin
  checkAuthenticatedUser(user)
  if (!hasRole(user, "admin")) {
    throw new ValidationError([{ key: "main", message: "Not allowed." }])
  }

  const { id, ...newcomerInput } = data.newcomerInput


  const newcomer = await Newcomers.findOne({ _id: ObjectId(id) })

  if (newcomerInput.email && invalidEmail(newcomerInput.email)) {
    throw new ValidationError([{ key: "email", message: "Invalid email." }])
  }
  const previousNewcomer = await newcomerExists(newcomerInput, Newcomers, Users)
  if (previousNewcomer && previousNewcomer._id.toString() !== id) {
    throw new ValidationError([{ key: "email", message: "A newcomer exists with this email." }])
  }

  const updatedNewcomer = { ...newcomer, ...newcomerInput }
  await Newcomers.update(newcomer, updatedNewcomer)
  return updatedNewcomer
}

export default updateNewcomerAdmin
