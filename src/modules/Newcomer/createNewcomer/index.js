import ValidationError from "../../_shared/ValidationError"
import invalidEmail from "../../_shared/invalidEmail"
import createDigits from "./createDigits"
import newcomerExists from "./newcomerExists"
import { sendNewcomerDigits } from "../mailer"
import createNewcomerToken from "../_shared/createNewcomerToken"

const createNewcomer = async (data, { mongo: { Newcomers, Users }, mailer }) => {
  const { newcomer } = data
  if (invalidEmail(newcomer.email)) {
    throw new ValidationError([{ key: "email", message: "Invalid email." }])
  }
  const previousNewcomer = await newcomerExists(newcomer, Newcomers, Users)
  newcomer.digits = createDigits()
  newcomer.token = await createNewcomerToken(newcomer.email)
  let response
  if (previousNewcomer) {
    newcomer.resent = true
    newcomer._id = previousNewcomer._id
    response = await Newcomers.updateOne({ ...previousNewcomer }, newcomer)
  } else {
    response = await Newcomers.insert(newcomer)
    const [_id] = response.insertedIds
    newcomer._id = _id
  }
  await sendNewcomerDigits(newcomer, mailer)
  return newcomer
}

export default createNewcomer
