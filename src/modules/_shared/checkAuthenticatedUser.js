import ValidationError from "./ValidationError"

const checkAuthenticatedUser = (user) => {
  if (!user) {
    throw new ValidationError([{
      key: "main",
      message: "Unauthenticated.",
    }])
  }
}

export default checkAuthenticatedUser
