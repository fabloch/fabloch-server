import mainMedia from "./Place/mainMedia"
import medias from "./Place/medias"
import createPlace from "./Mutation/createPlace"
import updatePlace from "./Mutation/updatePlace"
import deletePlace from "./Mutation/deletePlace"
import placeList from "./Query/placeList"
import placeDetail from "./Query/placeDetail"

export default {
  Query: {
    placeList,
    placeDetail,
  },
  Mutation: {
    createPlace,
    updatePlace,
    deletePlace,
  },
  Place: {
    id: place => place._id.toString(),
    mainMedia,
    medias,
    titleAny: eventModel => eventModel.title,
  },
}
