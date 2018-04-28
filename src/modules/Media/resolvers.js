import mediaList from "./Query/mediaList"
import saveMedia from "./Mutation/saveMedia"
import parent from "./Media/parent"

export default {
  Query: {
    mediaList: async (_, data, context) => mediaList(data, context),
  },
  Mutation: {
    saveMedia: async (_, data, context) => saveMedia(data, context),
  },
  Media: {
    id: media => media._id.toString(),
    parent: (media, __, context) => parent(media, context),
  },
}
