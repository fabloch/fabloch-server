import { ObjectId } from 'mongodb'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { JWT_SECRET } from '../../utils/config'

export default {
  Query: {
    User: async (_, { id }, { mongo: { Users } }) => {
      const user = await Users.findOne({
        _id: ObjectId(id),
      })
      return user
    },
  },
  Mutation: {
    createUser: async (_, data, { mongo: { Users } }) => {
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
        return {
          id: response.insertedIds[0],
          ...newUser,
        }
      }
      return Error('An account was already created with this email')
    },
    signinUser: async (_, data, context) => {
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
    // updateUser: async (_, data, context) => {
    //   const { mongo: { Users }, user } = context
    //   console.log("user", user)
    //   const persistedUser = await Users.findOne({ _id: user._id })
    //   console.log('persistedUser', persistedUser)
    //   let { version } = persistedUser.version
    //   version += 1
    //
    //   const newUser = {
    //     ...user,
    //     ...data,
    //     version,
    //   }
    //   if (data.password) {
    //     newUser.password = await bcrypt.hash(data.password, 10)
    //   }
    //   console.log('newUser', newUser)
    //
    //   const response = await Users.update({ _id: user._id }, newUser)
    //   if (response.result.ok) {
    //     console.log('ok')
    //     const token = await jwt.sign({
    //       id: newUser._id,
    //       email: newUser.email,
    //       version: newUser.version,
    //     }, JWT_SECRET)
    //     newUser.jwt = token
    //     return newUser
    //   }
    //   return Error('There was a problem with update')
    // },
  },
  User: {
    id: user => user._id.toString() || user.id,
  },
}
