import { ObjectId } from "mongodb"
import checkAuthenticatedUser from "../../_shared/checkAuthenticatedUser"
// import pubsub from "../../../utils/pubsub"
import isOwnerOrAdmin from "../../_shared/isOwnerOrAdmin"
import ValidationError from "../../_shared/ValidationError"

const updateEventModel = async (data, { mongo: { EventModels }, user }) => {
  const { eventModelInput } = data
  if (!eventModelInput.id) throw new ValidationError([{ key: "main", message: "No id provided." }])
  checkAuthenticatedUser(user)
  const eventModelFromDb = await EventModels.findOne({ _id: ObjectId(eventModelInput.id) })
  if (!isOwnerOrAdmin(eventModelFromDb, user)) {
    throw new ValidationError([{ key: "main", message: "Not owner." }])
  }
  if (eventModelInput.placeId) { eventModelInput.placeId = ObjectId(eventModelInput.placeId) }
  if (eventModelInput.speakerId) { eventModelInput.speakerId = ObjectId(eventModelInput.speakerId) }
  await EventModels.update(
    { _id: eventModelFromDb._id },
    { $set: { ...eventModelInput } },
  )
  return { ...eventModelFromDb, ...eventModelInput }
}

export default updateEventModel
