import createUser from "./createUser"
import signinUser from "./signinUser"
import updateUser from "./updateUser"

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
    memberships: async (user, _, context) => {
      const { mongo: { Memberships } } = context
      const memberships = await Memberships.find({ ownerId: user._id }).toArray()
      return memberships
    },
  },
}
