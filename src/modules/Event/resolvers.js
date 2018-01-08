import { ObjectId } from "mongodb"
import pubsub from "../../utils/pubsub"
import checkAuthenticatedUser from "../../validations/checkAuthenticatedUser"
import checkEventDates from "../../validations/checkEventDates"
import DoesNotExistError from "../../validations/DoesNotExistError"

/* eslint-disable camelcase */
const buildFilters = ({ OR = [], title_contains, description_contains }) => {
  const filter = (description_contains || title_contains) ? {} : null
  if (description_contains) {
    filter.description = { $regex: `.*${description_contains}.*` }
  }
  if (title_contains) {
    filter.title = { $regex: `.*${title_contains}.*` }
  }

  let filters = filter ? [filter] : []
  for (let i = 0; i < OR.length; i += 1) {
    filters = filters.concat(buildFilters(OR[i]))
  }
  return filters
}
/* eslint-enable */


export default {
  Query: {
    allEvents: async (_, { filter }, { mongo: { Events } }) => {
      const query = filter ? { $or: buildFilters(filter) } : {}
      const events = await Events.find(query).toArray()
      return events
    },
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
      pubsub.publish("Event", { Event: { mutation: "CREATED", node: newEvent } })
      return newEvent
    },
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
    bookings: async (event, _, { mongo: { EventTickets } }) =>
      EventTickets.find({ eventId: event._id }).count(),
    tickets: async (event, _, { mongo: { EventTickets } }) =>
      EventTickets.find({ eventId: event._id }).toArray(),
  },
}
