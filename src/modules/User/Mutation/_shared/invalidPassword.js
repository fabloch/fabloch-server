import { isLength } from "validator"

const invalidPassword = password => isLength(password, { min: 6, max: 20 }) === false

export default invalidPassword
