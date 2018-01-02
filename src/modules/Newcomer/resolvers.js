// import { ObjectId } from "mongodb"
import createDigits from "../../utils/createDigits"
import checkNewcomer from "../../validations/checkNewcomer"

export default {
  Mutation: {
    createNewcomer: async (_, data, { mongo: { Newcomers, Users } }) => {
      const { newcomer } = data
      await checkNewcomer(newcomer, Newcomers)
      await checkNewcomer(newcomer, Users)
      newcomer.digits = createDigits()
      const response = await Newcomers.insert(newcomer)
      const [id] = response.insertedIds
      newcomer.id = id
      return newcomer
    },
  },
}
