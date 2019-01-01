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
    userList,
  },
  Mutation: {
    createUser,
    signinUser,
    updateUser,
    updateProfile,
    createUserAdmin,
    updateUserAdmin,
    deleteUserAdmin,
  },
  User: {
    id: user => user._id.toString(),
    memberships,
    tickets,
    isAdmin,
  },
}
