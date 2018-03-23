import newcomerList from "./Query/newcomerList"
import createNewcomer from "./Mutation/createNewcomer"
import checkDigits from "./Mutation/checkDigits"

export default {
  Query: {
    newcomerList: async (_, __, context) => newcomerList(context),
  },
  Mutation: {
    createNewcomer: async (_, data, context) => createNewcomer(data, context),
    checkDigits: async (_, data, context) => checkDigits(data, context),
  },
  Newcomer: {
    id: newcomer => newcomer._id.toString(),
    valid: newcomer => newcomer.valid || false,
  },
}
