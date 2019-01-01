import { UserInputError } from "apollo-server"
import { isEmpty } from "ramda"

import checkPassword from "./_shared/checkPassword"
import checkUsername from "./_shared/checkUsername"
import createAuthToken from "./_shared/createAuthToken"
import hashPassword from "./_shared/hashPassword"

const createUser = async (
  parent,
  { authProvider: { newcomer } },
  { mongo: { Newcomers, Users } },
) => {
  let validationErrors = {}
  validationErrors = checkPassword(validationErrors, newcomer)
  validationErrors = checkUsername(validationErrors, newcomer)

  const newcomerFromDb = await Newcomers.findOne({ token: newcomer.token })
  if (!newcomerFromDb) {
    throw new UserInputError("No newcomer with that token.")
  }

  const previousUser = await Users.findOne({
    $or: [{ email: newcomerFromDb.email }, { username: newcomer.username }],
  })
  if (previousUser && newcomerFromDb.email === previousUser.email) {
    const emailTaken = "An account was already created with this email."
    if (validationErrors.email) {
      validationErrors.email.push(emailTaken)
    } else {
      validationErrors.email = [emailTaken]
    }
    throw new UserInputError("Failed to create user.", { validationErrors })
  }
  if (previousUser && newcomer.username === previousUser.username) {
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
    username: newcomer.username,
    email: newcomerFromDb.email,
    password: await hashPassword(newcomer.password),
    version: 1,
  }

  const userResponse = await Users.insertOne(newUser)
  const userId = userResponse.insertedId

  newUser.jwt = await createAuthToken(userId, newUser.email, newUser.version)
  await Newcomers.remove({ token: newcomer.token })
  return newUser
}

export default createUser
