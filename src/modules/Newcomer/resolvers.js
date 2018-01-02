// import { ObjectId } from "mongodb"
import createDigits from "../../utils/createDigits"
import checkNewcomer from "../../validations/checkNewcomer"
import { sendNewcomerDigits } from "./mailer"

export default {
  Mutation: {
    createNewcomer: async (_, data, { mongo: { Newcomers, Users }, mailer }) => {
      const { newcomer } = data
      await checkNewcomer(newcomer, Newcomers)
      await checkNewcomer(newcomer, Users)
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
