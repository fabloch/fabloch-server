import { ObjectId } from "mongodb"
import { UserInputError } from "apollo-server"
import { combineResolvers } from "graphql-resolvers"
import { isEmpty } from "ramda"

import { isAdmin } from "../../_shared/auth"
import { checkMissing, checkEmail } from "../../_shared/input"
import { checkAllPrevious } from "../_shared/checkPrevious"

const updateNewcomerAdmin = combineResolvers(isAdmin, async (parent, args, context) => {
  const {
    mongo: { Newcomers },
  } = context
  const { id, ...newcomerInput } = args.newcomerInput

  const newcomer = await Newcomers.findOne({ _id: ObjectId(id) })

  let validationErrors = {}
  validationErrors = checkEmail(validationErrors, "email", newcomerInput)
  validationErrors = await checkAllPrevious(validationErrors, args, context)
  if (!isEmpty(validationErrors)) {
    throw new UserInputError("Failed to save newcomer.", { validationErrors })
  }

  const updatedNewcomer = { ...newcomer, ...newcomerInput }
  await Newcomers.update(newcomer, updatedNewcomer)
  return updatedNewcomer
})

export default updateNewcomerAdmin
