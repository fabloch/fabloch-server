import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import ValidationError from "../../../_shared/ValidationError"
import { JWT_SECRET } from "../../../../utils/config"

const signinUser = async (data, { mongo: { Users } }) => {
  const user = await Users.findOne({ email: data.emailAuth.email })
  if (user) {
    const validatePassword = await bcrypt.compare(data.emailAuth.password, user.password)
    if (validatePassword) {
      const token = await jwt.sign({
        id: user.id,
        email: user.email,
        roles: user.roles,
        version: user.version,
      }, JWT_SECRET)
      user.jwt = token
      return user
    }
    throw new ValidationError([{ key: "main", message: "Email or password provided don't match." }])
  }
  throw new ValidationError([{ key: "main", message: "User does not exist." }])
}

export default signinUser
