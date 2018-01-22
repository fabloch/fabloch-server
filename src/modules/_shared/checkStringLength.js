import isLength from "validator/lib/isLength"

const invalidStringLength = (string, options = { min: 0, max: undefined }) => {
  if (isLength(string, options)) {
    return false
  }
  return true
}

export default invalidStringLength
