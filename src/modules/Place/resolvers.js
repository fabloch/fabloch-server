import mainMedia from "./Place/mainMedia"
import medias from "./Place/medias"
import createPlace from "./Mutation/createPlace"
import updatePlace from "./Mutation/updatePlace"
import deletePlace from "./Mutation/deletePlace"
import placeList from "./Query/placeList"
import placeDetail from "./Query/placeDetail"

export default {
  Query: {
    placeList: async (_, data, context) => placeList(data, context),
    placeDetail: async (_, data, context) => placeDetail(data, context),
  },
  Mutation: {
    createPlace: async (_, data, context) => createPlace(data, context),
    updatePlace: async (_, data, context) => updatePlace(data, context),
    deletePlace: async (_, data, context) => deletePlace(data, context),
  },
  Place: {
    id: place => place._id.toString(),
    mainMedia: async (eventModel, _, context) => mainMedia(eventModel, context),
    medias: async (eventModel, _, context) => medias(eventModel, context),
    titleAny: eventModel => eventModel.title,
  },
}
