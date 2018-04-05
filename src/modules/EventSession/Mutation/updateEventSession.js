import { ObjectId } from "mongodb"
import checkAuthenticatedUser from "../../_shared/checkAuthenticatedUser"
// import pubsub from "../../../utils/pubsub"
import isOwnerOrAdmin from "../../_shared/isOwnerOrAdmin"
import ValidationError from "../../_shared/ValidationError"
import checkEventDates from "./checkEventDates"

const updateEventSession = async (
  { eventSessionInput },
  { mongo: { EventCats, EventSessions }, user },
) => {
  if (!eventSessionInput.id) throw new ValidationError([{ key: "main", message: "No id provided." }])
  checkAuthenticatedUser(user)
  const eventSessionFromDb = await EventSessions.findOne({ _id: ObjectId(eventSessionInput.id) })
  if (!isOwnerOrAdmin(eventSessionFromDb, user)) {
    throw new ValidationError([{ key: "main", message: "Not owner." }])
  }
  let errors = []
  errors = checkEventDates(eventSessionInput, errors)
  if (errors.length) throw new ValidationError(errors)

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
  await EventSessions.update(
    { _id: eventSessionFromDb._id },
    { $set: { ...eventSession } },
  )
  return { ...eventSessionFromDb, ...eventSession }
}

export default updateEventSession
