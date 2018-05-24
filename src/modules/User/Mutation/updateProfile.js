import ValidationError from "../../_shared/ValidationError"
import checkAuthenticatedUser from "../../_shared/checkAuthenticatedUser"
import checkEmptyness from "./_shared/checkEmptyness"
import checkUrls from "./_shared/checkUrls"

const updateProfile = async ({ profileInput }, { mongo: { Users }, user }) => {
  console.log("profileInput", profileInput)

  checkAuthenticatedUser(user)
  let errors = []
  errors = checkEmptyness(errors, profileInput, ["fullName", "intro", "profilePic"])
  errors = checkUrls(
    errors,
    profileInput,
    ["facebookUrl", "twitterUrl", "githubUrl", "linkedInUrl", "otherUrl"],
  )
  if (errors.length) { throw new ValidationError(errors) }

  const newUser = {
    ...user,
    ...profileInput,
  }

  const response = await Users.update({ _id: user._id }, newUser)
  if (response.result.ok) {
    console.log(newUser)
    return newUser
  }
  return ValidationError([{ key: "main", message: "There was a problem with update." }])
}

export default updateProfile
