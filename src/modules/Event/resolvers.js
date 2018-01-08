import { ObjectId } from "mongodb"
import checkAuthenticatedUser from "../../validations/checkAuthenticatedUser"
import checkEventDates from "../../validations/checkEventDates"
import DoesNotExistError from "../../validations/DoesNotExistError"

export default {
  Query: {
    allEvents: async (_, __, { mongo: { Events } }) =>
      Events.find({}).toArray(),
    eventDetail: async (_, data, { mongo: { Events } }) => {
      const event = await Events.findOne({ _id: ObjectId(data.id) })
      if (!event) {
        throw DoesNotExistError("Event")
      }
      return event
    },

  },
  Mutation: {
    createEvent: async (_, data, { mongo: { Events }, user }) => {
      checkAuthenticatedUser(user)
      const newEvent = data.event
      checkEventDates(newEvent)
      newEvent.ownerId = user._id
      const response = await Events.insert(newEvent)
      const [_id] = response.insertedIds
      newEvent._id = _id
      return newEvent
    },
  },
  Event: {
    id: event => event._id.toString(),
    owner: async (event, _, { mongo: { Users } }) => Users.findOne({ _id: event.ownerId }),
    bookings: async (event, _, { mongo: { EventTickets } }) =>
      EventTickets.find({ eventId: event._id }).count(),
  },
}
