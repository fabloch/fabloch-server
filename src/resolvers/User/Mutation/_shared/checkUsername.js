import validator from "validator"

const checkUsername = (validationErrors, user) => {
  const regexp = /^[a-z0-9-_]+$/
  if (!validator.matches(user.username, regexp)) {
    const invalidUsername =
      "Username should only container lowercase letters, numbers, dashes or underscores."
    if (validationErrors.username) {
      validationErrors.username.push(invalidUsername)
    } else {
      validationErrors.username = [invalidUsername]
    }
  }
  return validationErrors
}

export default checkUsername
