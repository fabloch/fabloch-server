import { ObjectId } from "mongodb"
import checkAuthenticatedUser from "../../validations/checkAuthenticatedUser"
import checkEventForTicket from "../../validations/checkEventForTicket"

export default {
  Mutation: {
    saveEventTicket: async (_, data, { mongo: { EventModels, EventTickets }, user }) => {
      checkAuthenticatedUser(user)
      await checkEventForTicket(data.eventTicket.eventModelId, user, EventModels, EventTickets)
      const eventTicket = {
        participantId: user._id,
        eventModelId: ObjectId(data.eventTicket.eventModelId),
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
    eventModel: async (eventTicket, _, { mongo: { EventModels } }) => (
      EventModels.findOne({ _id: eventTicket.eventModelId })
    ),
  },
}
