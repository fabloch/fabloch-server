import ValidationError from "../../_shared/ValidationError"

const newcomerExists = async ({ newcomerInput }, { mongo: { Users, Newcomers } }) => {
  const userFromDb = await Users.findOne({ email: newcomerInput.email })
  if (userFromDb) {
    throw new ValidationError([
      {
        key: "email",
        message: "A user already exists with this email.",
      },
    ])
  }
  const newcomerFromDb = await Newcomers.findOne({ email: newcomerInput.email })
  if (newcomerFromDb) {
    return newcomerFromDb
  }
  return null
}

export default newcomerExists
