export const checkPreviousUser = async (
  validationErrors,
  { newcomerInput: { email } },
  { mongo: { Users } },
) => {
  const userFromDb = await Users.findOne({ email })
  const userExists = "A user already exists with this email."
  if (userFromDb) {
    if (validationErrors.email) {
      validationErrors.email.push(userExists)
    } else {
      validationErrors.email = [userExists]
    }
  }

  return validationErrors
}

export const checkPreviousNewcomer = async (
  validationErrors,
  { newcomerInput: { id, email } },
  { mongo: { Newcomers } },
) => {
  const newcomerFromDb = await Newcomers.findOne({ email })
  const newcomerExists = "A newcomer already exists with this email."
  if (newcomerFromDb && newcomerFromDb._id.toString() !== id) {
    if (validationErrors.email) {
      validationErrors.email.push(newcomerExists)
    } else {
      validationErrors.email = [newcomerExists]
    }
  }
  return validationErrors
}

export const checkAllPrevious = async (validationErrors, args, context) => {
  validationErrors = await checkPreviousUser(validationErrors, args, context)
  validationErrors = await checkPreviousNewcomer(validationErrors, args, context)
  return validationErrors
}
