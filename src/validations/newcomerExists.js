const newcomerExists = async (newcomer, NewcomerCollection, UserCollection) => {
  const userFromDb = await UserCollection.find({ email: newcomer.email }).count()
  if (userFromDb !== 0) {
    throw new Error("A user already exists with this email.")
  }
  const newcomerFromDb = await NewcomerCollection.find({ email: newcomer.email }).count()
  if (newcomerFromDb !== 0) {
    return true
  }
  return false
}

export default newcomerExists
