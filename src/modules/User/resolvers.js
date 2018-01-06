import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import checkAuthenticatedUser from "../../validations/checkAuthenticatedUser"
import checkExistinguser from "../../validations/checkExistinguser"
import { JWT_SECRET } from "../../utils/config"

export default {
  Query: {
    user: async (_, __, { user }) => user,
  },
  Mutation: {
    createUser: async (_, data, { mongo: { Users } }) => {
      await checkExistinguser(data.authProvider.email.email, Users)
      const passwordHash = await bcrypt.hash(data.authProvider.email.password, 10)
      const newUser = {
        email: data.authProvider.email.email,
        password: passwordHash,
        version: 1,
      }
      const response = await Users.insert(newUser)
      const _id = response.insertedIds[0]
      const token = await jwt.sign({
        id: _id,
        email: newUser.email,
        version: newUser.version,
      }, JWT_SECRET)
      newUser.jwt = token
      return newUser
    },
    signinUser: async (_, data, context) => {
      const { mongo: { Users } } = context
      const user = await Users.findOne({ email: data.emailAuth.email })
      if (user) {
        const validatePassword = await bcrypt.compare(data.emailAuth.password, user.password)
        if (validatePassword) {
          const token = await jwt.sign({
            id: user.id,
            email: user.email,
            version: user.version,
          }, JWT_SECRET)
          user.jwt = token
          return user
        }
        return Error("Email or password provided don't match")
      }
      return Error("User does not exist")
    },
    updateUser: async (_, data, context) => {
      const { mongo: { Users }, user } = context
      checkAuthenticatedUser(user)
      let { version } = user
      version += 1

      const newUser = {
        ...user,
        ...data,
        version,
      }
      if (data.password) {
        newUser.password = await bcrypt.hash(data.password, 10)
      }
      const response = await Users.update({ _id: user._id }, newUser)
      if (response.result.ok) {
        const token = await jwt.sign({
          id: newUser._id,
          email: newUser.email,
          version: newUser.version,
        }, JWT_SECRET)
        newUser.jwt = token
        return newUser
      }
      return Error("There was a problem with update")
    },
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
