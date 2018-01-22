import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../../../utils/config"

const createAuthToken = async (id, email, version) => jwt.sign({ id, email, version }, JWT_SECRET)

export default createAuthToken
