import bcrypt from "bcrypt"

const hashPassword = async password => bcrypt.hash(password, 10)

export default hashPassword
