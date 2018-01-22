import createNewcomer from "./createNewcomer"
import checkDigits from "./checkDigits"

export default {
  Mutation: {
    createNewcomer: async (_, data, context) => createNewcomer(data, context),
    checkDigits: async (_, data, context) => checkDigits(data, context),
  },
  Newcomer: {
    valid: newcomer => newcomer.valid || false,
  },
}
