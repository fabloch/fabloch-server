import newcomerList from "./Query/newcomerList"
import newcomerFromToken from "./Query/newcomerFromToken"

import createNewcomer from "./Mutation/createNewcomer"
import createNewcomerAdmin from "./Mutation/createNewcomerAdmin"
import updateNewcomerAdmin from "./Mutation/updateNewcomerAdmin"
import deleteNewcomerAdmin from "./Mutation/deleteNewcomerAdmin"
import checkDigits from "./Mutation/checkDigits"
import sendInvitations from "./Mutation/sendInvitations"

export default {
  Query: {
    newcomerList,
    newcomerFromToken,
  },
  Mutation: {
    createNewcomer,
    createNewcomerAdmin,
    updateNewcomerAdmin,
    deleteNewcomerAdmin,
    checkDigits,
    sendInvitations,
  },
  Newcomer: {
    id: newcomer => newcomer._id.toString(),
    guest: newcomer => newcomer.guest || false,
    valid: newcomer => newcomer.valid || false,
  },
}
