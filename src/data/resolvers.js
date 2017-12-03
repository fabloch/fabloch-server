import { ObjectID } from 'mongodb'
import { URL } from 'url'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pubsub from '../pubsub'
import { JWT_SECRET } from '../config'

class ValidationError extends Error {
  constructor(message, field) {
    super(message)
    this.field = field
  }
}

const assertValidLink = ({ url }) => {
  try {
    new URL(url)
  } catch(error) {
    throw new ValidationError('Link validation error: invalid url.', 'url')
  }
}

const assertAuthenticated = (user) => {
  if (!user) {
    throw new Error('Unauthenticated.')
  }
}

const buildFilters = ({ OR = [], description_contains, url_contains }) => {
  const filter = (description_contains || url_contains) ? {} : null
  if (description_contains) {
    filter.description = { $regex: `.*${description_contains}.*` }
  }
  if (url_contains) {
    filter.url = { $regex: `.*${url_contains}.*` }
  }
  let filters = filter ? [filter] : []
  for (let i = 0; i < OR.length; i += 1) {
    filters = filters.concat(buildFilters(OR[i]))
  }
  return filters
}

module.exports = {
  Query: {
    allLinks: async (root, { filter, first, skip }, { mongo: { Links }, user }) => {
      console.log(user) // eslint-disable-line no-console
      const query = filter ? { $or: buildFilters(filter) } : {}
      const cursor = Links.find(query)
      if (first) {
        cursor.limit(first)
      }
      if (skip) {
        cursor.skip(skip)
      }
      return cursor.toArray()
    },
  },

  Mutation: {
    createLink: async (root, data, { mongo: { Links }, user }) => {
      assertValidLink(data)
      assertAuthenticated(user)
      const newLink = Object.assign({ postedById: user && user._id }, data)
      const response = await Links.insert(newLink)
      const [id] = response.insertedIds
      newLink.id = id
      pubsub.publish('Link', { Link: { mutation: 'CREATED', node: newLink } })
      return newLink
    },
    createVote: async (root, data, { mongo: { Votes }, user }) => {
      const newVote = {
        userId: user && user._id,
        linkId: new ObjectID(data.linkId),
      }
      const response = await Votes.insert(newVote)
      return Object.assign({ id: response.insertedIds[0] }, newVote)
    },
    createUser: async (root, data, { mongo: { Users } }) => {
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
    signinUser: async (root, data, { mongo: { Users } }) => {
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
  },

  Subscription: {
    Link: {
      subscribe: () => pubsub.asyncIterator('Link'),
    },
  },

  Link: {
    id: root => root._id || root.id,
    postedBy: async ({ postedById }, data, { dataloaders: { userLoaderById } }) =>
      userLoaderById.load(postedById),
    votes: async ({ _id }, data, { mongo: { Votes } }) =>
      Votes.find({ linkId: _id }).toArray(),
  },
  User: {
    // Convert the "_id" field from MongoDB to "id" from the schema.
    id: root => root._id || root.id,
    votes: async ({ _id }, data, { mongo: { Votes } }) =>
      Votes.find({ userId: _id }).toArray(),
  },
  Vote: {
    id: root => root._id || root.id,
    user: async ({ userId }, data, { dataloaders: { userLoaderById } }) =>
      userLoaderById.load(userId),
    link: async ({ linkId }, data, { mongo: { Links } }) =>
      Links.findOne({ _id: linkId }),
  },
}
