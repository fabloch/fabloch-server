import { ObjectId } from "mongodb"
import checkAuthenticatedUser from "../../_shared/checkAuthenticatedUser"
import pubsub from "../../../utils/pubsub"

const createEventModel = async (
  { eventModelInput },
  { mongo: { EventCats, EventModels }, user },
) => {
  checkAuthenticatedUser(user)

  const eventModel = eventModelInput
  eventModel.ownerId = user._id
  if (eventModel.placeId) { eventModel.placeId = ObjectId(eventModel.placeId) }
  if (eventModel.speakerId) { eventModel.speakerId = ObjectId(eventModel.speakerId) }
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
  const response = await EventModels.insert(eventModel)
  const [_id] = response.insertedIds
  eventModel._id = _id
  pubsub.publish("EventModel", { EventModel: { mutation: "CREATED", node: eventModel } })
  return eventModel
}

export default createEventModel
