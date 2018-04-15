import userList from "./Query/userList"

import createUser from "./Mutation/createUser"
import signinUser from "./Mutation/signinUser"
import updateUser from "./Mutation/updateUser"
import updateProfile from "./Mutation/updateProfile"

import createUserAdmin from "./Mutation/createUserAdmin"
import updateUserAdmin from "./Mutation/updateUserAdmin"
import deleteUserAdmin from "./Mutation/deleteUserAdmin"

import memberships from "./User/memberships"
import tickets from "./User/tickets"
import isAdmin from "./User/isAdmin"

export default {
  Query: {
    user: async (_, __, { user }) => user,
    userList: async (_, __, context) => userList(context),
  },
  Mutation: {
    createUser: async (_, data, context) => createUser(data, context),
    signinUser: async (_, data, context) => signinUser(data, context),
    updateUser: async (_, data, context) => updateUser(data, context),
    updateProfile: async (_, data, context) => updateProfile(data, context),
    createUserAdmin: async (_, data, context) => createUserAdmin(data, context),
    updateUserAdmin: async (_, data, context) => updateUserAdmin(data, context),
    deleteUserAdmin: async (_, data, context) => deleteUserAdmin(data, context),
  },
  User: {
    id: user => user._id.toString(),
    memberships: async (user, _, context) => memberships(user, context),
    tickets: async (user, _, context) => tickets(user, context),
    isAdmin: async (user, _, context) => isAdmin(user, context),
  },
}
