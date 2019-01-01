import { UserInputError } from "apollo-server"
import { isEmpty } from "ramda"
import { combineResolvers } from "graphql-resolvers"

import { isAdmin } from "../../_shared/auth"
import checkPassword from "./_shared/checkPassword"
import checkUsername from "./_shared/checkUsername"
import createAuthToken from "./_shared/createAuthToken"
import hashPassword from "./_shared/hashPassword"

const createUserAdmin = combineResolvers(
  isAdmin,
  async (parent, { userInput }, { mongo: { Users } }) => {
    let validationErrors = {}
    validationErrors = checkPassword(validationErrors, userInput)
    validationErrors = checkUsername(validationErrors, userInput)

    const previousUser = await Users.findOne({
      $or: [{ email: userInput.email }, { username: userInput.username }],
    })
    if (previousUser && userInput.email === previousUser.email) {
      const emailTaken = "An account was already created with this email."
      if (validationErrors.email) {
        validationErrors.email.push(emailTaken)
      } else {
        validationErrors.email = [emailTaken]
      }
      throw new UserInputError("Failed to create user.", { validationErrors })
    }
    if (previousUser && userInput.username === previousUser.username) {
      const usernameTaken = "This username is not available."
      if (validationErrors.username) {
        validationErrors.username.push(usernameTaken)
      } else {
        validationErrors.username = [usernameTaken]
      }
      throw new UserInputError("Failed to create user.", { validationErrors })
    }
    if (!isEmpty(validationErrors)) {
      throw new UserInputError("Failed to create user.", { validationErrors })
    }

    const newUser = {
      ...userInput,
      password: await hashPassword(userInput.password),
      version: 1,
    }

    const userResponse = await Users.insertOne(newUser)
    const userId = userResponse.insertedId

    newUser.jwt = await createAuthToken(userId, newUser.email, newUser.version)
    return newUser
  },
)

export default createUserAdmin
