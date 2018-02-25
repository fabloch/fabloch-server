import zxcvbn from "zxcvbn"

const checkPasswordStrength = (password) => {
  const result = zxcvbn(password)
  if (result.score < 2) {
    return true
  }
  return false
}

export default checkPasswordStrength
