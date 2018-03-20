import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import ValidationError from "../../../_shared/ValidationError"
import checkAuthenticatedUser from "../../../_shared/checkAuthenticatedUser"
import { JWT_SECRET } from "../../../../utils/config"

const updateUser = async ({ userInput }, { mongo: { Users }, user }) => {
  checkAuthenticatedUser(user)
  let { version } = user
  if (userInput.email || userInput.username || userInput.password) {
    version += 1
  }

  const newUser = {
    ...user,
    ...userInput,
    version,
  }
  if (userInput.password) {
    newUser.password = await bcrypt.hash(userInput.password, 10)
  }
  const response = await Users.update({ _id: user._id }, newUser)
  if (response.result.ok) {
    const token = await jwt.sign({
      id: newUser._id,
      email: newUser.email,
      version: newUser.version,
    }, JWT_SECRET)
    newUser.jwt = token
    return newUser
  }
  return ValidationError([{ key: "main", message: "There was a problem with update." }])
}

export default updateUser
