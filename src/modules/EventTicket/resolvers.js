import { ObjectId } from "mongodb"
import checkAuthenticatedUser from "../../validations/checkAuthenticatedUser"
import checkEventForTicket from "../../validations/checkEventForTicket"

export default {
  Mutation: {
    createEventTicket: async (_, data, { mongo: { Events, EventTickets }, user }) => {
      checkAuthenticatedUser(user)
      await checkEventForTicket(data.eventTicket.eventId, Events, EventTickets)
      const eventTicket = {
        participantId: user._id,
        eventId: ObjectId(data.eventTicket.eventId),
      }
      const response = await EventTickets.insert(eventTicket)
      const [_id] = response.insertedIds
      eventTicket._id = _id
      return eventTicket
    },
  },
  EventTicket: {
    id: eventTicket => eventTicket._id.toString(),
    participant: async (eventTicket, _, { mongo: { Users } }) => (
      Users.findOne({ _id: eventTicket.participantId })
    ),
    event: async (eventTicket, _, { mongo: { Events } }) => (
      Events.findOne({ _id: eventTicket.eventId })
    ),
  },
}
