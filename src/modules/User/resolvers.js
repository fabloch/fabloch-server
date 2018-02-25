import createUser from "./Mutation/createUser"
import signinUser from "./Mutation/signinUser"
import updateUser from "./Mutation/updateUser"

import memberships from "./User/memberships"
import isAdmin from "./User/isAdmin"

export default {
  Query: {
    user: async (_, __, { user }) => user,
  },
  Mutation: {
    createUser: async (_, data, context) => createUser(data, context),
    signinUser: async (_, data, context) => signinUser(data, context),
    updateUser: async (_, data, context) => updateUser(data, context),
  },
  User: {
    id: user => user._id.toString(),
    memberships: async (user, _, context) => memberships(user, context),
    isAdmin: async (user, _, context) => isAdmin(user, context),
  },
}
