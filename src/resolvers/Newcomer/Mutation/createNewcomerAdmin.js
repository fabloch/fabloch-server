import { combineResolvers } from "graphql-resolvers"
import { UserInputError } from "apollo-server"
import { isEmpty } from "ramda"

import { checkAllPrevious } from "../_shared/checkPrevious"
import { checkMissing, checkEmail } from "../../_shared/input"
import createNewcomerToken from "../_shared/createNewcomerToken"
import { isAdmin } from "../../_shared/auth"

const createNewcomerAdmin = combineResolvers(isAdmin, async (parent, args, context) => {
  const { newcomerInput } = args
  const {
    mongo: { Newcomers },
  } = context
  newcomerInput.guest = true
  let validationErrors = {}
  validationErrors = checkMissing(validationErrors, "email", newcomerInput)
  validationErrors = checkEmail(validationErrors, "email", newcomerInput)
  validationErrors = await checkAllPrevious(validationErrors, args, context)
  if (!isEmpty(validationErrors)) {
    throw new UserInputError("Failed to save newcomer.", { validationErrors })
  }

  newcomerInput.token = await createNewcomerToken(newcomerInput.email)
  const response = await Newcomers.insertOne(newcomerInput)
  newcomerInput._id = response.insertedId
  return newcomerInput
})

export default createNewcomerAdmin
