import { UserInputError } from "apollo-server"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import { JWT_SECRET } from "../../../utils/config"

const signinUser = async (parent, args, { mongo: { Users } }) => {
  const user = await Users.findOne({ email: args.emailAuth.email })
  if (user) {
    const validatePassword = await bcrypt.compare(args.emailAuth.password, user.password)
    if (validatePassword) {
      const token = await jwt.sign(
        {
          id: user.id,
          email: user.email,
          roles: user.roles,
          version: user.version,
        },
        JWT_SECRET,
      )
      user.jwt = token
      return user
    }
    throw new UserInputError("Email or password provided don't match.")
  }
  throw new UserInputError("User does not exist.")
}

export default signinUser
