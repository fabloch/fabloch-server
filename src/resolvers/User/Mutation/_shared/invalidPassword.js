import { isLength } from "validator"

const checkPasswordLength = (validationErrors, field, parent) => {
  if (isLength(parent[field], { min: 6, max: 48 }) === false) {
    const invalidLength = "Password must have length between 6 and 48 chars."
    if (validationErrors[field]) {
      validationErrors[field].push(invalidLength)
    } else {
      validationErrors[field] = [invalidLength]
    }
  }
  return validationErrors
}

export default checkPasswordLength
