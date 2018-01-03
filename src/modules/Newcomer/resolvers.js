import { ObjectId } from "mongodb"
import createDigits from "../../utils/createDigits"
import newcomerExists from "../../validations/newcomerExists"
import { sendNewcomerDigits } from "./mailer"

export default {
  Mutation: {
    createNewcomer: async (_, data, { mongo: { Newcomers, Users }, mailer }) => {
      const { newcomer } = data
      const previousNewcomer = await newcomerExists(newcomer, Newcomers, Users)
      newcomer.digits = createDigits()
      let response
      if (previousNewcomer) {
        newcomer.resent = true
        newcomer.id = previousNewcomer._id.toString()
        response = await Newcomers.updateOne({ ...previousNewcomer }, newcomer)
      } else {
        response = await Newcomers.insert(newcomer)
        const [id] = response.insertedIds
        newcomer.id = id
      }
      await sendNewcomerDigits(newcomer, mailer)
      return newcomer
    },
  },
  Newcomer: {
    id: newcomer => newcomer._id.toString(),
    digits: newcomer => newcomer.digits,
  },
}
