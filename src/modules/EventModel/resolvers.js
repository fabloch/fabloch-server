import pubsub from "../../utils/pubsub"

import eventCats from "./EventModel/eventCats"
import place from "./EventModel/place"
import speaker from "./EventModel/speaker"
import mainMedia from "./EventModel/mainMedia"
import medias from "./EventModel/medias"
import eventModelList from "./Query/eventModelList"
import eventModelDetail from "./Query/eventModelDetail"
import createEventModel from "./Mutation/createEventModel"
import deleteEventModel from "./Mutation/deleteEventModel"
import updateEventModel from "./Mutation/updateEventModel"

export default {
  Query: {
    eventModelList: async (_, data, context) => eventModelList(data, context),
    eventModelDetail: async (_, data, context) => eventModelDetail(data, context),

  },
  Mutation: {
    createEventModel: async (_, data, context) => createEventModel(data, context),
    deleteEventModel: async (_, data, context) => deleteEventModel(data, context),
    updateEventModel: async (_, data, context) => updateEventModel(data, context),
  },
  Subscription: {
    EventModel: {
      // subscribe: (_, __, { wsUser }) => pubsub.asyncIterator("EventModel"),
      subscribe: () => pubsub.asyncIterator("EventModel"),
    },
  },
  EventModel: {
    id: eventModel => eventModel._id.toString(),
    mainMedia: async (eventModel, _, context) => mainMedia(eventModel, context),
    medias: async (eventModel, _, context) => medias(eventModel, context),
    owner: async (eventModel, _, { mongo: { Users } }) =>
      Users.findOne({ _id: eventModel.ownerId }),
    place: async (eventModel, _, context) => place(eventModel, context),
    speaker: async (eventModel, _, context) => speaker(eventModel, context),
    eventCats: eventModel => eventCats(eventModel),

    titleAny: eventModel => eventModel.title,
    introAny: eventModel => eventModel.intro,
    descriptionAny: eventModel => eventModel.description,
    seatsAny: eventModel => eventModel.seats,
    speakerAny: async (eventModel, _, context) => speaker(eventModel, context),
    placeAny: async (eventModel, _, context) => place(eventModel, context),
    eventCatsAny: eventModel => eventCats(eventModel),
  },
}
