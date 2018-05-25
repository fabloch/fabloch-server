import newcomerList from "./Query/newcomerList"
import newcomerFromToken from "./Query/newcomerFromToken"

import createNewcomer from "./Mutation/createNewcomer"
import createNewcomerAdmin from "./Mutation/createNewcomerAdmin"
import updateNewcomerAdmin from "./Mutation/updateNewcomerAdmin"
import checkDigits from "./Mutation/checkDigits"
import sendInvitations from "./Mutation/sendInvitations"

export default {
  Query: {
    newcomerList: async (_, __, context) => newcomerList(context),
    newcomerFromToken: async (_, data, context) => newcomerFromToken(data, context),
  },
  Mutation: {
    createNewcomer: async (_, data, context) => createNewcomer(data, context),
    createNewcomerAdmin: async (_, data, context) => createNewcomerAdmin(data, context),
    updateNewcomerAdmin: async (_, data, context) => updateNewcomerAdmin(data, context),
    checkDigits: async (_, data, context) => checkDigits(data, context),
    sendInvitations: async (_, data, context) => sendInvitations(data, context),
  },
  Newcomer: {
    id: newcomer => newcomer._id.toString(),
    guest: newcomer => newcomer.guest || false,
    valid: newcomer => newcomer.valid || false,
  },
}
