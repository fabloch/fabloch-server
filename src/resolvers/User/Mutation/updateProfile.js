import { combineResolvers } from "graphql-resolvers"
import { isEmpty } from "ramda"
import { UserInputError } from "apollo-server"

import { isAuthenticated } from "../../_shared/auth"
import { checkEmpty, checkUrl } from "../../_shared/input"
const updateProfile = combineResolvers(
  isAuthenticated,
  async (parent, { profileInput }, { mongo: { Users }, user }) => {
    let validationErrors = {}
    validationErrors = checkEmpty(validationErrors, "fullName", profileInput)
    validationErrors = checkEmpty(validationErrors, "intro", profileInput)
    validationErrors = checkEmpty(validationErrors, "profilePic", profileInput)
    validationErrors = checkUrl(validationErrors, "facebookUrl", profileInput)
    validationErrors = checkUrl(validationErrors, "twitterUrl", profileInput)
    validationErrors = checkUrl(validationErrors, "githubUrl", profileInput)
    validationErrors = checkUrl(validationErrors, "linkedInUrl", profileInput)
    validationErrors = checkUrl(validationErrors, "otherUrl", profileInput)
    if (!isEmpty(validationErrors)) {
      throw new UserInputError("Failed to update profile.", { validationErrors })
    }

    const newUser = {
      ...user,
      ...profileInput,
    }

    const response = await Users.update({ _id: user._id }, newUser)
    if (response.result.ok) {
      return newUser
    }
    return UserInputError("There was a problem with update.")
  },
)

export default updateProfile
