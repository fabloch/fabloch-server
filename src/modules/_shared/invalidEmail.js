import validator from "validator"

const invalidEmail = (email) => {
  if (validator.isEmail(email)) {
    return false
  }
  return true
}

export default invalidEmail
