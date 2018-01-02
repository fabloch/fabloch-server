import { ObjectId } from "mongodb"
import checkAuthenticatedUser from "../../validations/checkAuthenticatedUser"
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
      newEvent.ownerId = user._id
      const response = await Events.insert(newEvent)
      const [id] = response.insertedIds
      newEvent.id = id
      return newEvent
    },
  },
  Event: {
    id: event => event._id.toString(),
    owner: async (event, _, { mongo: Users }) => Users.findOne({ _id: event.owner }),
  },
}
