import { combineResolvers } from "graphql-resolvers"
import { isEmpty } from "ramda"
import { ObjectId } from "mongodb"
import { UserInputError } from "apollo-server"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import { checkEmail, checkEmpty, checkPasswordLength } from "../../_shared/input"
import { isAdmin } from "../../_shared/auth"

import ValidationError from "../../_shared/ValidationError"
import invalidUsername from "./_shared/invalidUsername"
import { JWT_SECRET } from "../../../utils/config"

const updateUserAdmin = combineResolvers(
  isAdmin,
  async (parent, { userInput }, { mongo: { Users } }) => {
    const prevUser = await Users.findOne({ _id: ObjectId(userInput.id) })

    let validationErrors = {}

    validationErrors = checkEmpty(validationErrors, "username", userInput)
    validationErrors = checkEmpty(validationErrors, "email", userInput)

    if (userInput.username && userInput.username !== prevUser.username) {
      if (invalidUsername(userInput.username)) {
        const invalidUsername =
          "Username should only container lowercase letters, numbers, dashes or underscores."
        if (validationErrors.username) {
          validationErrors.username.push(invalidUsername)
        } else {
          validationErrors.username = [invalidUsername]
        }
      }
      const otherUser = await Users.findOne({ username: userInput.username })
      if (otherUser) {
        const usernameTaken = "Username is already taken."
        if (validationErrors.username) {
          validationErrors.username.push(usernameTaken)
        } else {
          validationErrors.username = [usernameTaken]
        }
      }
    }
    if (userInput.email && userInput.email !== prevUser.email) {
      validationErrors = checkEmail(validationErrors, "email", userInput)
      const otherUser = await Users.findOne({ email: userInput.email })
      if (otherUser) {
        const emailTaken = "Email is already taken."
        if (validationErrors.email) {
          validationErrors.email.push(emailTaken)
        } else {
          validationErrors.email = [emailTaken]
        }
      }
    }

    const newUser = { ...prevUser, ...userInput }
    if (userInput.newPassword) {
      validationErrors = checkPasswordLength(validationErrors, "newPassword", userInput)
      newUser.password = await bcrypt.hash(userInput.newPassword, 10)
    }

    if (!isEmpty(validationErrors)) {
      throw new UserInputError("Failed to update user.", { validationErrors })
    }

    const response = await Users.updateOne({ _id: prevUser._id }, { $set: { newUser } })
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
    return ValidationError([{ key: "main", message: "There was a problem with update." }])
  },
)

export default updateUserAdmin
