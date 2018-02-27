import { ObjectId } from "mongodb"
import checkAuthenticatedUser from "../../_shared/checkAuthenticatedUser"
import checkEventDates from "./checkEventDates"
import pubsub from "../../../utils/pubsub"
import isOwnerOrAdmin from "../../_shared/isOwnerOrAdmin"
import ValidationError from "../../_shared/ValidationError"

/*
  id ? update : create
*/

const saveEvent = async ({ eventInput }, { mongo: { Events }, user }) => {
  checkAuthenticatedUser(user)
  let errors = []
  errors = checkEventDates(eventInput, errors)
  console.log(errors)
  if (errors.length) throw new ValidationError(errors)
  if (eventInput.id) {
    const eventFromDb = await Events.findOne({ _id: ObjectId(eventInput.id) })
    if (!isOwnerOrAdmin(eventFromDb, user)) {
      throw new ValidationError({ key: "main", messages: ["You don't own this event."] })
    }
    await Events.update(
      { _id: eventFromDb._id },
      { $set: { ...eventInput } },
      { returnOriginal: false },
    )
    return { ...eventFromDb, ...eventInput }
  }

  const event = eventInput
  event.ownerId = user._id
  const response = await Events.insert(event)
  const [_id] = response.insertedIds
  event._id = _id
  pubsub.publish("Event", { Event: { mutation: "CREATED", node: event } })
  return event
}

export default saveEvent
