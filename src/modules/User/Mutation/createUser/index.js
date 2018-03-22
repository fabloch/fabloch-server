import ValidationError from "../../../_shared/ValidationError"
import invalidPassword from "../shared/invalidPassword"
import invalidUsername from "./invalidUsername"
import createAuthToken from "./createAuthToken"
import hashPassword from "./hashPassword"

const createUser = async (
  { authProvider: { newcomer } },
  {
    mongo: {
      Newcomers,
      Users,
    },
  },
) => {
  const errors = []
  const newcomerFromDb = await Newcomers.findOne({ token: newcomer.token })
  if (!newcomerFromDb) {
    throw new ValidationError([{ key: "main", message: "No newcomer with that token." }])
  }
  const previousUser = await Users.findOne({
    $or: [
      { email: newcomerFromDb.email },
      { username: newcomer.username },
    ],
  })
  if (previousUser && newcomerFromDb.email === previousUser.email) {
    errors.push({
      key: "main",
      message: "An account was already created with this email.",
    })
  }
  if (previousUser && newcomer.username === previousUser.username) {
    errors.push({
      key: "username",
      message: "This username is not available.",
    })
  }
  if (invalidPassword(newcomer.password)) {
    errors.push({
      key: "password",
      message: "Password is too weak.",
    })
  }
  if (invalidUsername(newcomer.username)) {
    errors.push({
      key: "username",
      message: "Username should only container lowercase letters, numbers, dashes or underscores.",
    })
  }

  if (errors.length) throw new ValidationError(errors)

  const newUser = {
    username: newcomer.username,
    email: newcomerFromDb.email,
    password: await hashPassword(newcomer.password),
    version: 1,
  }

  const userResponse = await Users.insert(newUser)
  const userId = userResponse.insertedIds[0]

  newUser.jwt = await createAuthToken(userId, newUser.email, newUser.version)
  await Newcomers.remove({ token: newcomer.token })
  return newUser
}

export default createUser
