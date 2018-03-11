import { ObjectId } from "mongodb"
import checkAuthenticatedUser from "../../_shared/checkAuthenticatedUser"
// import pubsub from "../../../utils/pubsub"
import isOwnerOrAdmin from "../../_shared/isOwnerOrAdmin"
import ValidationError from "../../_shared/ValidationError"
import checkEventDates from "./checkEventDates"
import checkForbidden from "../../_shared/checkForbidden"

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
  checkForbidden(
    ["title", "intro", "description", "seats", "placeId", "eventCats"],
    eventSessionInput,
    errors,
  )
  if (errors.length) throw new ValidationError(errors)

  const eventSession = eventSessionInput
  if (eventSession.eventModelId) {
    eventSession.eventModelId = ObjectId(eventSession.eventModelId)
  }
  if (eventSession.ownerId) {
    eventSession.ownerId = ObjectId(eventSession.ownerId)
  }
  if (eventSession.placeSuperId) {
    eventSession.placeSuperId = ObjectId(eventSession.placeSuperId)
  }
  if (eventSession.eventCatsSuperIds) {
    const ids = eventSession.eventCatsSuperIds.map(id => ObjectId(id))
    const ecList = await EventCats.find({ _id: { $in: ids } }).toArray()
    const eventCatsSuper = ecList.map(ec => ({
      id: ec._id,
      name: ec.name,
      color: ec.color,
    }))
    eventSession.eventCatsSuper = eventCatsSuper
  }
  await EventSessions.update(
    { _id: eventSessionFromDb._id },
    { $set: { ...eventSession } },
  )
  return { ...eventSessionFromDb, ...eventSession }
}

export default updateEventSession
