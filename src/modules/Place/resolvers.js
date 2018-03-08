import createPlace from "./Mutation/createPlace"
import updatePlace from "./Mutation/updatePlace"
import deletePlace from "./Mutation/deletePlace"

import placeList from "./Query/placeList"

export default {
  Query: {
    placeList: async (_, data, context) => placeList(data, context),
  },
  Mutation: {
    createPlace: async (_, data, context) => createPlace(data, context),
    updatePlace: async (_, data, context) => updatePlace(data, context),
    deletePlace: async (_, data, context) => deletePlace(data, context),
  },
  Place: {
    id: place => place._id.toString(),
  },
}
