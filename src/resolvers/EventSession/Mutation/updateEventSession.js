import { ObjectId } from "mongodb"
import { UserInputError } from "apollo-server"
import { combineResolvers } from "graphql-resolvers"
import { isEmpty } from "ramda"

import { isAuthenticated, isOwnerOrAdmin } from "../../_shared/auth"
import { checkMissing } from "../../_shared/input"
import checkEventDates from "./checkEventDates"

const updateEventSession = combineResolvers(
  isAuthenticated,
  async (_, { eventSessionInput }, { mongo: { EventCats, EventSessions }, user }) => {
    let validationErrors = {}
    validationErrors = checkMissing(validationErrors, "eventModelId", eventSessionInput)
    validationErrors = checkMissing(validationErrors, "id", eventSessionInput)
    validationErrors = checkEventDates(validationErrors, eventSessionInput)
    if (!isEmpty(validationErrors)) {
      throw new UserInputError("Failed to update event session.", { validationErrors })
    }
    const eventSessionFromDb = await EventSessions.findOne({ _id: ObjectId(eventSessionInput.id) })
    isOwnerOrAdmin(eventSessionFromDb, user)

    const eventSession = eventSessionInput
    if (eventSession.eventModelId) {
      eventSession.eventModelId = ObjectId(eventSession.eventModelId)
    }
    if (eventSession.ownerId) {
      eventSession.ownerId = ObjectId(eventSession.ownerId)
    }
    if (eventSession.placeId) {
      eventSession.placeId = ObjectId(eventSession.placeId)
    }
    if (eventSession.speakerId) {
      eventSession.speakerId = ObjectId(eventSession.speakerId)
    }
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
    await EventSessions.update({ _id: eventSessionFromDb._id }, { $set: { ...eventSession } })
    return { ...eventSessionFromDb, ...eventSession }
  },
)

export default updateEventSession
