import checkAuthenticatedUser from "../../_shared/checkAuthenticatedUser"
import checkEventDates from "./checkEventDates"
import pubsub from "../../../utils/pubsub"
import hasRole from "../../_shared/hasRole"
import checkMissing from "../../_shared/checkMissing"
import ValidationError from "../../_shared/ValidationError"

const createEvent = async ({ eventInput }, { mongo: { Events }, user }) => {
  checkAuthenticatedUser(user)
  let errors = []
  errors = checkMissing(["title", "start", "end"], eventInput, errors)
  errors = checkEventDates(eventInput, errors)

  if (errors.length) throw new ValidationError(errors)

  const event = eventInput
  if (hasRole(user, "admin")) {
    event.admin = true
  }
  event.ownerId = user._id
  const response = await Events.insert(event)
  const [_id] = response.insertedIds
  event._id = _id
  pubsub.publish("Event", { Event: { mutation: "CREATED", node: event } })
  return event
}

export default createEvent
