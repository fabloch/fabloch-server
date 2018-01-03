// import { ObjectId } from "mongodb"
import createDigits from "../../utils/createDigits"
import newcomerExists from "../../validations/newcomerExists"
import { sendNewcomerDigits } from "./mailer"

export default {
  Mutation: {
    createNewcomer: async (_, data, { mongo: { Newcomers, Users }, mailer }) => {
      const { newcomer } = data
      const resend = await newcomerExists(newcomer, Newcomers, Users)
      if (resend) {
        newcomer.resent = true
      }
      newcomer.digits = createDigits()
      const response = await Newcomers.insert(newcomer)
      const [id] = response.insertedIds
      newcomer.id = id
      await sendNewcomerDigits(newcomer, mailer)
      return newcomer
    },
  },
  Newcomer: {
    id: newcomer => newcomer._id.toString(),
  },
}
