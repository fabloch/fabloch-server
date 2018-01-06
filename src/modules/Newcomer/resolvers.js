import { ObjectId } from "mongodb"
import { isEqual } from "lodash"
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
        console.log("createNewcomer: ", previousNewcomer._id.toString())
        newcomer._id = previousNewcomer._id
        response = await Newcomers.updateOne({ ...previousNewcomer }, newcomer)
      } else {
        response = await Newcomers.insert(newcomer)
        const [_id] = response.insertedIds
        newcomer._id = _id
      }
      await sendNewcomerDigits(newcomer, mailer)
      return newcomer
    },
    checkDigits: async (_, data, { mongo: { Newcomers } }) => {
      const newcomer = await Newcomers.findOne({ _id: ObjectId(data.newcomer.id) })
      if (!newcomer) {
        throw new Error("Newcomer with that id doesn't exist.")
      }
      if (!isEqual(newcomer.digits, data.newcomer.digits)) {
        throw new Error("Digits don't match.")
      }
      return newcomer
    },
  },
  Newcomer: {
    id: newcomer => newcomer._id.toString(),
    // digits: newcomer => newcomer.digits,
  },
}
