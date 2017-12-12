import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { JWT_SECRET } from '../utils/config'

const userResolver = {
  Mutation: {
    createUser: async (root, data, context) => {
      const { mongo: { Users } } = context
      const existingUser = await Users.findOne({
        email: data.authProvider.email.email,
      })
      if (!existingUser) {
        const passwordHash = await bcrypt.hash(data.authProvider.email.password, 10)
        const newUser = {
          name: data.name,
          email: data.authProvider.email.email,
          password: passwordHash,
          version: 1,
        }
        const response = await Users.insert(newUser)
        return Object.assign({ id: response.insertedIds[0] }, newUser)
      }
      return Error('An account was already created with this email')
    },
    signinUser: async (root, data, context) => {
      const { mongo: { Users } } = context
      const user = await Users.findOne({ email: data.email.email })
      if (user) {
        const validatePassword = await bcrypt.compare(data.email.password, user.password)
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
      return Error('User does not exist')
    },
    updateUser: async (root, data, context) => {
      const { mongo: { Users }, user } = context
      console.log("user", user)
      const persistedUser = await Users.findOne({ _id: user._id })
      console.log('persistedUser', persistedUser)
      let { version } = persistedUser.version
      version += 1

      const newUser = {
        ...user,
        ...data,
        version,
      }
      if (data.password) {
        newUser.password = await bcrypt.hash(data.password, 10)
      }
      console.log('newUser', newUser)

      const response = await Users.update({ _id: user._id }, newUser)
      if (response.result.ok) {
        console.log('ok')
        const token = await jwt.sign({
          id: newUser._id,
          email: newUser.email,
          version: newUser.version,
        }, JWT_SECRET)
        newUser.jwt = token
        return newUser
      }
      return Error('There was a problem with update')
    },
  },
  User: {
    // Convert the '_id' field from MongoDB to 'id' from the schema.
    id: root => root._id || root.id,
    votes: async ({ _id }, data, { mongo: { Votes } }) =>
      Votes.find({ userId: _id }).toArray(),
  },
}

export default userResolver
