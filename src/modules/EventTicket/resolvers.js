import createEventTicket from "./Mutation/createEventTicket"

export default {
  Mutation: {
    createEventTicket: async (_, data, context) => createEventTicket(data, context),
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
