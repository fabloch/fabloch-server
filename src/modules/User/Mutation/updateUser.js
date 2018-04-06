import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import ValidationError from "../../_shared/ValidationError"
import checkAuthenticatedUser from "../../_shared/checkAuthenticatedUser"
import invalidPassword from "./_shared/invalidPassword"
import checkEmptyness from "./_shared/checkEmptyness"
import invalidEmail from "../../_shared/invalidEmail"
import { JWT_SECRET } from "../../../utils/config"

const updateUser = async ({ userInput }, { mongo: { Users }, user }) => {
  checkAuthenticatedUser(user)
  const version = user.version + 1

  let errors = []
  errors = checkEmptyness(errors, userInput, ["username", "email", "password", "newPassword"])

  if (userInput.username && userInput.username !== user.username) {
    const otherUser = await Users.findOne({ username: userInput.username })
    if (otherUser) {
      errors.push({ key: "username", message: "Username taken." })
    }
  }
  if (userInput.email && invalidEmail(userInput.email)) {
    errors.push({ key: "email", message: "Invalid email." })
  }
  const oldPasswordValid = await bcrypt.compare(userInput.password, user.password)
  if (!oldPasswordValid) {
    errors.push({ key: "password", message: "Password does not match." })
  }

  const newUser = {
    ...user,
    ...userInput,
    version,
  }
  if (userInput.newPassword) {
    if (userInput.newPassword === "" || invalidPassword(userInput.newPassword)) {
      errors.push({ key: "newPassword", message: "Password too weak." })
    }
    newUser.password = await bcrypt.hash(userInput.newPassword, 10)
  } else {
    newUser.password = user.password
  }

  if (errors.length) { throw new ValidationError(errors) }

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
