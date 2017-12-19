function getAuthenticatedUser(user) {
  if (!user) {
    throw new Error('Unauthenticated.')
  }
  return user
}

export default getAuthenticatedUser
