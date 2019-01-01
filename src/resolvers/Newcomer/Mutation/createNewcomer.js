import { UserInputError } from "apollo-server"
import { isEmpty } from "ramda"

import { checkPreviousUser } from "../_shared/checkPrevious"
import { checkMissing, checkEmail } from "../../_shared/input"
import createDigits from "../_shared/createDigits"
import { sendNewcomerDigits } from "../mailer"
import createNewcomerToken from "../_shared/createNewcomerToken"

const createNewcomer = async (parent, args, context) => {
  const { newcomerInput } = args
  const {
    mongo: { Newcomers },
    mailer,
  } = context
  let validationErrors = {}
  validationErrors = checkMissing(validationErrors, "email", newcomerInput)
  validationErrors = checkEmail(validationErrors, "email", newcomerInput)
  await checkPreviousUser(validationErrors, args, context)
  if (!isEmpty(validationErrors)) {
    throw new UserInputError("Failed to save newcomer.", { validationErrors })
  }

  newcomerInput.digits = createDigits()
  newcomerInput.token = await createNewcomerToken(newcomerInput.email)
  const newcomerFromDb = await Newcomers.findOne({ email: newcomerInput.email })
  let response, newcomer
  if (newcomerFromDb) {
    response = await Newcomers.replaceOne({ email: newcomerInput.email }, { newcomerInput })
    newcomer = { ...newcomerFromDb, ...newcomerInput, resent: true, valid: false }
  } else {
    response = await Newcomers.insertOne(newcomerInput)
    newcomer = { ...newcomerInput, _id: response.insertedId }
  }
  sendNewcomerDigits(newcomer, mailer)
  return newcomer
}

export default createNewcomer
