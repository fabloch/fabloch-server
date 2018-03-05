import saveMedia from "./Mutation/saveMedia"

export default {
  Mutation: {
    saveMedia: async (_, data, context) => saveMedia(data, context),
  },
  Media: {
    id: media => media._id.toString(),
  },
}
