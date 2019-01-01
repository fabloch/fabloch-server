import mediaList from "./Query/mediaList"
import saveMedia from "./Mutation/saveMedia"
import deleteMedia from "./Mutation/deleteMedia"
import parent from "./Media/parent"

export default {
  Query: {
    mediaList,
  },
  Mutation: {
    saveMedia,
    deleteMedia,
  },
  Media: {
    id: media => media._id.toString(),
    parent,
  },
}
