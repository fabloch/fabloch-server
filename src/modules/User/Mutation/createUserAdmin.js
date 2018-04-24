import ValidationError from "../../_shared/ValidationError"
import checkAuthenticatedUser from "../../_shared/checkAuthenticatedUser"
import hasRole from "../../_shared/hasRole"
import invalidPassword from "./_shared/invalidPassword"
import invalidUsername from "./_shared/invalidUsername"
import createAuthToken from "./_shared/createAuthToken"
import hashPassword from "./_shared/hashPassword"

const createUserAdmin = async ({ userInput }, { mongo: { Users }, user }) => {
  checkAuthenticatedUser(user)
  if (!hasRole(user, "admin")) {
    throw new ValidationError([{ key: "main", message: "Not allowed." }])
  }

  const errors = []
  const previousUser = await Users.findOne({
    $or: [
      { email: userInput.email },
      { username: userInput.username },
    ],
  })
  if (previousUser && userInput.email === previousUser.email) {
    errors.push({
      key: "email",
      message: "An account was already created with this email.",
    })
  }
  if (previousUser && userInput.username === previousUser.username) {
    errors.push({
      key: "username",
      message: "This username is not available.",
    })
  }
  if (invalidPassword(userInput.password)) {
    errors.push({
      key: "password",
      message: "Password too weak.",
    })
  }
  if (invalidUsername(userInput.username)) {
    errors.push({
      key: "username",
      message: "Username should only container lowercase letters, numbers, dashes or underscores.",
    })
  }
  if (errors.length) throw new ValidationError(errors)

  const newUser = {
    ...userInput,
    password: await hashPassword(userInput.password),
    version: 1,
  }

  const userResponse = await Users.insert(newUser)
  const userId = userResponse.insertedIds[0]

  newUser.jwt = await createAuthToken(userId, newUser.email, newUser.version)
  return newUser
}

export default createUserAdmin
