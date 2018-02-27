import { ObjectId } from "mongodb"
import checkAuthenticatedUser from "../../_shared/checkAuthenticatedUser"
import checkEventDates from "./checkEventDates"
import pubsub from "../../../utils/pubsub"
import isOwnerOrAdmin from "../../_shared/isOwnerOrAdmin"
import ValidationError from "../../_shared/ValidationError"

/*
  id ? update : create
*/

const saveEventModel = async ({ eventModelInput }, { mongo: { EventModels }, user }) => {
  checkAuthenticatedUser(user)
  let errors = []
  errors = checkEventDates(eventModelInput, errors)
  if (errors.length) throw new ValidationError(errors)
  if (eventModelInput.id) {
    const eventModelFromDb = await EventModels.findOne({ _id: ObjectId(eventModelInput.id) })
    if (!isOwnerOrAdmin(eventModelFromDb, user)) {
      throw new ValidationError({ key: "main", messages: ["You don't own this eventModel."] })
    }
    await EventModels.update(
      { _id: eventModelFromDb._id },
      { $set: { ...eventModelInput } },
      { returnOriginal: false },
    )
    return { ...eventModelFromDb, ...eventModelInput }
  }

  const eventModel = eventModelInput
  eventModel.ownerId = user._id
  const response = await EventModels.insert(eventModel)
  const [_id] = response.insertedIds
  eventModel._id = _id
  pubsub.publish("EventModel", { EventModel: { mutation: "CREATED", node: eventModel } })
  return eventModel
}

export default saveEventModel
