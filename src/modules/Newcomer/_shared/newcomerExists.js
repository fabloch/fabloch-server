import ValidationError from "../../_shared/ValidationError"

const newcomerExists = async (newcomer, NewcomerCollection, UserCollection) => {
  const userFromDb = await UserCollection.findOne({ email: newcomer.email })
  if (userFromDb) {
    throw new ValidationError([{
      key: "email",
      message: "A user already exists with this email.",
    }])
  }
  const newcomerFromDb = await NewcomerCollection.findOne({ email: newcomer.email })
  if (newcomerFromDb) {
    return newcomerFromDb
  }
  return null
}

export default newcomerExists
