import newcomerList from "./Query/newcomerList"
import createNewcomer from "./Mutation/createNewcomer"
import createNewcomerAdmin from "./Mutation/createNewcomerAdmin"
import checkDigits from "./Mutation/checkDigits"
import sendInvitations from "./Mutation/sendInvitations"

export default {
  Query: {
    newcomerList: async (_, __, context) => newcomerList(context),
  },
  Mutation: {
    createNewcomer: async (_, data, context) => createNewcomer(data, context),
    createNewcomerAdmin: async (_, data, context) => createNewcomerAdmin(data, context),
    checkDigits: async (_, data, context) => checkDigits(data, context),
    sendInvitations: async (_, data, context) => sendInvitations(data, context),
  },
  Newcomer: {
    id: newcomer => newcomer._id.toString(),
    valid: newcomer => newcomer.valid || false,
  },
}
