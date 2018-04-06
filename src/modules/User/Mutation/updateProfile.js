import ValidationError from "../../_shared/ValidationError"
import checkAuthenticatedUser from "../../_shared/checkAuthenticatedUser"
import checkEmptyness from "./_shared/checkEmptyness"

const updateUser = async ({ profileInput }, { mongo: { Users }, user }) => {
  checkAuthenticatedUser(user)
  let errors = []
  errors = checkEmptyness(errors, profileInput, ["fullName", "intro", "profilePic"])
  if (errors.length) { throw new ValidationError(errors) }

  const newUser = {
    ...user,
    profile: {
      ...user.profile,
      ...profileInput,
    },
  }

  const response = await Users.update({ _id: user._id }, newUser)
  if (response.result.ok) {
    return newUser
  }
  return ValidationError([{ key: "main", message: "There was a problem with update." }])
}

export default updateUser
