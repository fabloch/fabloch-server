import createEventTicket from "./Mutation/createEventTicket"
import deleteEventTicket from "./Mutation/deleteEventTicket"

export default {
  Mutation: {
    createEventTicket: async (_, data, context) => createEventTicket(data, context),
    deleteEventTicket: async (_, data, context) => deleteEventTicket(data, context),
  },
  EventTicket: {
    id: eventTicket => eventTicket._id.toString(),
    owner: async (eventTicket, _, { mongo: { Users } }) => (
      Users.findOne({ _id: eventTicket.ownerId })
    ),
    eventSession: async (eventTicket, _, { mongo: { EventSessions } }) => (
      EventSessions.findOne({ _id: eventTicket.eventSessionId })
    ),
  },
}
