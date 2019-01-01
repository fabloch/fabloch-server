import { ObjectId } from "mongodb"
import { UserInputError } from "apollo-server"
import { combineResolvers } from "graphql-resolvers"
import { isEmpty } from "ramda"
import { isAuthenticated } from "../../_shared/auth"

import pubsub from "../../../utils/pubsub"

const createEventModel = combineResolvers(
  isAuthenticated,
  async (_, { eventModelInput }, { mongo: { EventCats, EventModels }, user }) => {
    const eventModel = eventModelInput
    eventModel.ownerId = user._id
    if (eventModel.placeId) {
      eventModel.placeId = ObjectId(eventModel.placeId)
    }
    if (eventModel.speakerId) {
      eventModel.speakerId = ObjectId(eventModel.speakerId)
    }
    if (eventModel.eventCatIds) {
      const ids = eventModel.eventCatIds.map(id => ObjectId(id))
      const ecList = await EventCats.find({ _id: { $in: ids } }).toArray()
      const eventCats = ecList.map(ec => ({
        id: ec._id,
        name: ec.name,
        color: ec.color,
      }))
      eventModel.eventCats = eventCats
    }
    const response = await EventModels.insertOne(eventModel)
    eventModel._id = response.insertedId
    pubsub.publish("EventModel", { EventModel: { mutation: "CREATED", node: eventModel } })
    return eventModel
  },
)
export default createEventModel
