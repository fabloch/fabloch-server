import pubsub from "../../utils/pubsub"

import bookings from "./EventModel/bookings"
import tickets from "./EventModel/tickets"
import place from "./EventModel/place"
import eventModelList from "./Query/eventModelList"
import eventModelDetail from "./Query/eventModelDetail"
import saveEventModel from "./Mutation/saveEventModel"

export default {
  Query: {
    eventModelList: async (_, data, context) => eventModelList(data, context),
    eventModelDetail: async (_, data, context) => eventModelDetail(data, context),

  },
  Mutation: {
    saveEventModel: async (_, data, context) => saveEventModel(data, context),
  },
  Subscription: {
    EventModel: {
      // subscribe: (_, __, { wsUser }) => pubsub.asyncIterator("EventModel"),
      subscribe: () => pubsub.asyncIterator("EventModel"),
    },
  },
  EventModel: {
    id: eventModel => eventModel._id.toString(),
    owner: async (eventModel, _, { mongo: { Users } }) => Users.findOne({ _id: eventModel.ownerId }),
    bookings: async (eventModel, _, context) => bookings(eventModel, context),
    tickets: async (eventModel, _, context) => tickets(eventModel, context),
    place: async (eventModel, _, context) => place(eventModel, context),
  },
}
