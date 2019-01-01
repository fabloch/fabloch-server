import { ObjectId } from "mongodb"
import { UserInputError } from "apollo-server"
import { combineResolvers } from "graphql-resolvers"
import { isEmpty } from "ramda"

import { isAuthenticated } from "../../_shared/auth"
import { checkMissing } from "../../_shared/input"
import checkEventDates from "./checkEventDates"
import pubsub from "../../../utils/pubsub"

const createEventSession = combineResolvers(
  isAuthenticated,
  async (_, { eventSessionInput }, { mongo: { EventCats, EventModels, EventSessions }, user }) => {
    let validationErrors = {}
    validationErrors = checkMissing(validationErrors, "eventModelId", eventSessionInput)
    validationErrors = checkEventDates(validationErrors, eventSessionInput)
    if (!isEmpty(validationErrors)) {
      throw new UserInputError("Failed to create event session.", { validationErrors })
    }
    const eventModel = await EventModels.findOne({ _id: ObjectId(eventSessionInput.eventModelId) })
    if (!eventModel)
      throw new UserInputError(`No event model found with id ${eventSessionInput.eventModelId}`)

    const eventSession = eventSessionInput
    eventSession.ownerId = user._id
    eventSession.eventModelId = eventModel._id

    // placeId
    if (eventSession.placeId) {
      eventSession.placeId = ObjectId(eventSession.placeId)
    }

    // speakerId
    if (eventSession.speakerId) {
      eventSession.speakerId = ObjectId(eventSession.speakerId)
    }

    // eventCatIds
    if (eventSession.eventCatIds) {
      const ids = eventSession.eventCatIds.map(id => ObjectId(id))
      const ecList = await EventCats.find({ _id: { $in: ids } }).toArray()
      const eventCats = ecList.map(ec => ({
        id: ec._id,
        name: ec.name,
        color: ec.color,
      }))
      eventSession.eventCats = eventCats
    }

    const response = await EventSessions.insertOne(eventSession)
    eventSession._id = response.insertedId
    pubsub.publish("EventSession", { EventSession: { mutation: "CREATED", node: eventSession } })
    return eventSession
  },
)

export default createEventSession
