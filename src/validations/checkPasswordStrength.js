import zxcvbn from "zxcvbn"

const checkPasswordStrength = (password) => {
  const result = zxcvbn(password)
  if (result.score < 2) {
    throw new Error("Password too weak.")
  }
}

export default checkPasswordStrength
