import pubsub from "../../utils/pubsub"

import description from "./EventSession/description"
import hasTicket from "./EventSession/hasTicket"
import mainMedia from "./EventSession/mainMedia"
import medias from "./EventSession/medias"
import place from "./EventSession/place"
import seats from "./EventSession/seats"
import ticketCount from "./EventSession/ticketCount"
import tickets from "./EventSession/tickets"
import title from "./EventSession/title"
import eventSessionList from "./Query/eventSessionList"
import eventSessionDetail from "./Query/eventSessionDetail"
import createEventSession from "./Mutation/createEventSession"
import updateEventSession from "./Mutation/updateEventSession"

export default {
  Query: {
    eventSessionList: async (_, data, context) => eventSessionList(data, context),
    eventSessionDetail: async (_, data, context) => eventSessionDetail(data, context),
  },
  Mutation: {
    createEventSession: async (_, data, context) => createEventSession(data, context),
    updateEventSession: async (_, data, context) => updateEventSession(data, context),
  },
  Subscription: {
    EventSession: {
      // subscribe: (_, __, { wsUser }) => pubsub.asyncIterator("EventSession"),
      subscribe: () => pubsub.asyncIterator("EventSession"),
    },
  },
  EventSession: {
    id: eventSession => eventSession._id.toString(),
    description: async (eventSession, _, context) => description(eventSession, context),
    hasTicket: async (eventSession, _, context) => hasTicket(eventSession, context),
    mainMedia: async (eventSession, _, context) => mainMedia(eventSession, context),
    medias: async (eventSession, _, context) => medias(eventSession, context),
    owner: async (eventSession, _, { mongo: { Users } }) =>
      Users.findOne({ _id: eventSession.ownerId }),
    place: async (eventSession, _, context) => place(eventSession, context),
    seats: async (eventSession, _, context) => seats(eventSession, context),
    ticketCount: async (eventSession, _, context) => ticketCount(eventSession, context),
    tickets: async (eventSession, _, context) => tickets(eventSession, context),
    title: async (eventSession, _, context) => title(eventSession, context),
  },
}
