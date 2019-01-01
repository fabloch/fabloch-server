import { combineResolvers } from "graphql-resolvers"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { isEmpty } from "ramda"
import { UserInputError } from "apollo-server"

import { isAuthenticated } from "../../_shared/auth"
import { checkEmail, checkEmpty, checkPasswordLength } from "../../_shared/input"
import { JWT_SECRET } from "../../../utils/config"

const updateUser = combineResolvers(
  isAuthenticated,
  async (parent, { userInput }, { mongo: { Users }, user }) => {
    const version = user.version + 1

    let validationErrors = {}
    validationErrors = checkEmpty(validationErrors, "username", userInput)
    validationErrors = checkEmpty(validationErrors, "email", userInput)
    validationErrors = checkEmpty(validationErrors, "password", userInput)
    validationErrors = checkEmpty(validationErrors, "newPassword", userInput)

    if (userInput.username && userInput.username !== user.username) {
      const otherUser = await Users.findOne({ username: userInput.username })
      if (otherUser) {
        if (validationErrors.username) {
          validationErrors.username.push("Username is already taken.")
        }
        validationErrors.username = ["Username is already taken."]
      }
    }

    validationErrors = checkEmail(validationErrors, "email", userInput)
    const oldPasswordValid = await bcrypt.compare(userInput.password, user.password)
    if (!oldPasswordValid) {
      validationErrors.password = ["Password does not match."]
    }

    const newUser = {
      ...user,
      ...userInput,
      version,
    }
    if (userInput.newPassword) {
      validationErrors = checkPasswordLength(validationErrors, "newPassword", userInput)
      newUser.password = await bcrypt.hash(userInput.newPassword, 10)
    } else {
      newUser.password = user.password
    }

    if (!isEmpty(validationErrors)) {
      throw new UserInputError("Failed to create user.", { validationErrors })
    }

    const response = await Users.update({ _id: user._id }, newUser)
    if (response.result.ok) {
      const token = await jwt.sign(
        {
          id: newUser._id,
          email: newUser.email,
          version: newUser.version,
        },
        JWT_SECRET,
      )
      newUser.jwt = token
      return newUser
    }
    return UserInputError("There was a problem with update.")
  },
)

export default updateUser
