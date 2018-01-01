function checkAuthenticatedUser(user) {
  if (!user) {
    throw new Error("Unauthenticated.")
  }
}

export default checkAuthenticatedUser
