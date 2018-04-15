import { ObjectId } from "mongodb"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import hasRole from "../../_shared/hasRole"
import ValidationError from "../../_shared/ValidationError"
import checkAuthenticatedUser from "../../_shared/checkAuthenticatedUser"
import invalidPassword from "./_shared/invalidPassword"
import invalidUsername from "./_shared/invalidUsername"
import checkEmptyness from "./_shared/checkEmptyness"
import invalidEmail from "../../_shared/invalidEmail"
import { JWT_SECRET } from "../../../utils/config"

const updateUserAdmin = async ({ userInput }, { mongo: { Users }, user }) => {
  checkAuthenticatedUser(user)
  if (!hasRole(user, "admin")) {
    throw new ValidationError([{ key: "main", message: "Not allowed." }])
  }

  const prevUser = await Users.findOne({ _id: ObjectId(userInput.id) })

  let errors = []

  errors = checkEmptyness(errors, userInput, ["username", "email", "password"])

  if (userInput.username && userInput.username !== prevUser.username) {
    if (invalidUsername(userInput.username)) {
      errors.push({
        key: "username",
        message: "Username should only container lowercase letters, numbers, dashes or underscores.",
      })
    }
    const otherUser = await Users.findOne({ username: userInput.username })
    if (otherUser) {
      errors.push({ key: "username", message: "Username taken." })
    }
  }
  if (userInput.email && userInput.email !== prevUser.email) {
    if (invalidEmail(userInput.email)) {
      errors.push({ key: "email", message: "Invalid email." })
    }
    const otherUser = await Users.findOne({ email: userInput.email })
    if (otherUser) {
      errors.push({ key: "email", message: "Email taken." })
    }
  }

  const newUser = { ...prevUser, ...userInput }
  if (userInput.profile) { newUser.profile = { ...prevUser.profile, ...userInput.profile } }
  if (userInput.password) {
    if (userInput.password === "" || invalidPassword(userInput.password)) {
      errors.push({ key: "password", message: "Password too weak." })
    }
    newUser.password = await bcrypt.hash(userInput.password, 10)
  } else {
    newUser.password = prevUser.password
  }

  if (errors.length) { throw new ValidationError(errors) }

  const response = await Users.update({ _id: prevUser._id }, newUser)
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

export default updateUserAdmin
