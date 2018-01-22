import validator from "validator"

export default (username) => {
  const regexp = /^[a-z0-9-_]+$/
  if (!validator.matches(username, regexp)) {
    return true
  }
  return false
}
