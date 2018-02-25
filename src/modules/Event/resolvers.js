import pubsub from "../../utils/pubsub"

import bookings from "./Event/bookings"
import tickets from "./Event/tickets"
import place from "./Event/place"
import eventList from "./Query/eventList"
import eventDetail from "./Query/eventDetail"
import createEvent from "./Mutation/createEvent"

export default {
  Query: {
    eventList: async (_, data, context) => eventList(data, context),
    eventDetail: async (_, data, context) => eventDetail(data, context),

  },
  Mutation: {
    createEvent: async (_, data, context) => createEvent(data, context),
  },
  Subscription: {
    Event: {
      // subscribe: (_, __, { wsUser }) => pubsub.asyncIterator("Event"),
      subscribe: () => pubsub.asyncIterator("Event"),
    },
  },
  Event: {
    id: event => event._id.toString(),
    owner: async (event, _, { mongo: { Users } }) => Users.findOne({ _id: event.ownerId }),
    bookings: async (event, _, context) => bookings(event, context),
    tickets: async (event, _, context) => tickets(event, context),
    place: async (event, _, context) => place(event, context),
  },
}
