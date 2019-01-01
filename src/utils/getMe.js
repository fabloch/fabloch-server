import { AuthenticationError } from "apollo-server-express"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "./config"

const getMe = async req => {
  const token = req.headers["x-token"]

  if (token) {
    try {
      return await jwt.verify(token, JWT_SECRET)
    } catch (e) {
      throw new AuthenticationError("Your session expired. Sign in again.")
    }
  }
}

export default getMe
