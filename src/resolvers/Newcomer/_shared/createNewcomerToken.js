import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../../../utils/config"

const createNewcomerToken = async email => jwt.sign({ email }, JWT_SECRET)

export default createNewcomerToken
