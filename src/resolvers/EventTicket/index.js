import createEventTicket from "./Mutation/createEventTicket"
import deleteEventTicket from "./Mutation/deleteEventTicket"

export default {
  Mutation: {
    createEventTicket,
    deleteEventTicket,
  },
  EventTicket: {
    id: eventTicket => eventTicket._id.toString(),
    owner: async (eventTicket, _, { mongo: { Users } }) =>
      Users.findOne({ _id: eventTicket.ownerId }),
    eventSession: async (eventTicket, _, { mongo: { EventSessions } }) =>
      EventSessions.findOne({ _id: eventTicket.eventSessionId }),
  },
}
