import { isLength } from "validator"

const checkPassword = (validationErrors, user) => {
  if (isLength(user.password, { min: 6, max: 48 }) === false) {
    const invalidPassword = "Password should have length between 6 and 48 characters."
    if (validationErrors.password) {
      validationErrors.password.push(invalidPassword)
    } else {
      validationErrors.password = [invalidPassword]
    }
  }
  return validationErrors
}

export default checkPassword
