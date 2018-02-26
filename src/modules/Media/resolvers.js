import createMedia from "./Mutation/createMedia"

export default {
  Mutation: {
    createMedia: async (_, data, context) => createMedia(data, context),
  },
  Media: {
    id: media => media._id.toString(),
  },
}
