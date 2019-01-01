import { ObjectId } from "mongodb"
import { UserInputError } from "apollo-server"
import { combineResolvers } from "graphql-resolvers"
import { isEmpty } from "ramda"
// import pubsub from "../../../utils/pubsub"

import { isAuthenticated, isOwnerOrAdmin } from "../../_shared/auth"
import { checkMissing } from "../../_shared/input"

const updateEventModel = combineResolvers(
  isAuthenticated,
  async (parent, args, { mongo: { EventCats, EventModels }, user }) => {
    const { eventModelInput } = args
    let validationErrors = {}
    validationErrors = checkMissing(validationErrors, "id", eventModelInput)
    if (!isEmpty(validationErrors)) {
      throw new UserInputError("Failed to update event model.", { validationErrors })
    }
    const eventModelFromDb = await EventModels.findOne({ _id: ObjectId(eventModelInput.id) })
    isOwnerOrAdmin(eventModelFromDb, user)

    if (eventModelInput.placeId) {
      eventModelInput.placeId = ObjectId(eventModelInput.placeId)
    }
    if (eventModelInput.speakerId) {
      eventModelInput.speakerId = ObjectId(eventModelInput.speakerId)
    }
    if (eventModelInput.eventCatIds) {
      const ids = eventModelInput.eventCatIds.map(id => ObjectId(id))
      const ecList = await EventCats.find({ _id: { $in: ids } }).toArray()
      const eventCats = ecList.map(ec => ({
        id: ec._id,
        name: ec.name,
        color: ec.color,
      }))
      eventModelInput.eventCats = eventCats
    }
    await EventModels.updateOne({ _id: eventModelFromDb._id }, { $set: { ...eventModelInput } })
    return { ...eventModelFromDb, ...eventModelInput }
  },
)

export default updateEventModel
