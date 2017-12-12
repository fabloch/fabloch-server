import pubsub from '../pubsub'
import assertValidLink from '../validations/assertValidLink'
import getAuthenticatedUser from '../validations/getAuthenticatedUser'

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

const linkResolver = {
  Query: {
    allLinks: async (root, { filter, first, skip }, context) => {
      const { mongo: { Links } } = context
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
    createLink: async (root, data, context) => {
      const { mongo: { Links }, user } = context
      assertValidLink(data)
      getAuthenticatedUser(context)
      const newLink = Object.assign({ postedById: user && user._id }, data)
      const response = await Links.insert(newLink)
      const [id] = response.insertedIds
      newLink.id = id
      pubsub.publish('Link', { Link: { mutation: 'CREATED', node: newLink } })
      return newLink
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
}

export default linkResolver
