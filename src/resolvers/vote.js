import { ObjectID } from 'mongodb'

const voteResolver = {
  Mutation: {
    createVote: async (root, data, context) => {
      const { mongo: { Votes }, user } = context
      const newVote = {
        userId: user && user._id,
        linkId: new ObjectID(data.linkId),
      }
      const response = await Votes.insert(newVote)
      return Object.assign({ id: response.insertedIds[0] }, newVote)
    },
  },
  Vote: {
    id: root => root._id || root.id,
    user: async ({ userId }, data, { dataloaders: { userLoaderById } }) =>
      userLoaderById.load(userId),
    link: async ({ linkId }, data, { mongo: { Links } }) =>
      Links.findOne({ _id: linkId }),
  },
}

export default voteResolver
