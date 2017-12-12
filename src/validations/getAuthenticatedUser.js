async function getAuthenticatedUser(context) {
  const user = await context.user
  if (!user) {
    throw new Error('Unauthenticated.')
  }
  return user
}

export default getAuthenticatedUser
