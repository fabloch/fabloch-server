import createPlace from "./Mutation/createPlace"

import placeList from "./Query/placeList"

export default {
  Query: {
    placeList: async (_, data, context) => placeList(data, context),
  },
  Mutation: {
    createPlace: async (_, data, context) => createPlace(data, context),
  },
  Place: {
    id: place => place._id.toString(),
  },
}
