import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../../../utils/config"
import ValidationError from "../../_shared/ValidationError"

const getNewcomerFromToken = async (token, Newcomers) => {
  let newcomer
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    newcomer = await Newcomers.findOne({ email: payload.email })
  } catch (e) {
    throw new ValidationError([{
      key: "main",
      message: "Invalid token.",
    }])
  }
  return newcomer
}

export default getNewcomerFromToken
